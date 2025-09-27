import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { HeadphonesIcon, MicrophoneIcon, SpinnerIcon } from './Icons';

type ConnectionState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';
type TranscriptItem = {
    speaker: 'user' | 'ai';
    text: string;
};

// --- Audio Encoding/Decoding Helpers ---
// These functions are implemented manually as required by the Live API guidelines.

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// FIX: The 'LiveSession' type is not exported from the '@google/genai' package, causing an import error.
// To resolve this, `LiveSession` was removed from the import statement and a local interface is defined here
// for the session object to maintain type safety.
interface LiveSession {
  close: () => void;
  sendRealtimeInput: (input: { media: Blob }) => void;
}


const AudioGuide: React.FC = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [liveUserTranscript, setLiveUserTranscript] = useState('');
    const [liveAiTranscript, setLiveAiTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');
    
    const nextStartTime = useRef(0);
    const outputAudioSources = useRef(new Set<AudioBufferSourceNode>());
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, liveUserTranscript, liveAiTranscript]);


    const cleanup = useCallback(() => {
        console.log("Cleaning up resources...");
        
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => {
                console.log("Closing session.");
                session.close();
            }).catch(e => console.error("Error closing session:", e));
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioSources.current.forEach(source => {
                try {
                    source.stop();
                } catch(e) {
                    // Ignore errors if the source has already stopped
                }
            });
            outputAudioSources.current.clear();
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        
        setConnectionState('idle');
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);


    const handleToggleSession = async () => {
        if (connectionState !== 'idle' && connectionState !== 'error') {
            cleanup();
            return;
        }

        setConnectionState('connecting');
        setError(null);
        setTranscript([]);
        setLiveUserTranscript('');
        setLiveAiTranscript('');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTime.current = 0;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.log('Session opened.');
                        setConnectionState('listening');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            currentInputTranscription.current += text;
                            setLiveUserTranscript(currentInputTranscription.current);
                        }
                         if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            currentOutputTranscription.current += text;
                            setConnectionState('speaking');
                            setLiveAiTranscript(currentOutputTranscription.current);
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscription.current.trim();
                            const fullOutput = currentOutputTranscription.current.trim();
                            
                            setLiveUserTranscript('');
                            setLiveAiTranscript('');
                            
                            setTranscript(prev => {
                                const newTranscript = [...prev];
                                if (fullInput) {
                                    newTranscript.push({ speaker: 'user', text: fullInput });
                                }
                                if (fullOutput) {
                                    newTranscript.push({ speaker: 'ai', text: fullOutput });
                                }
                                return newTranscript;
                            });
                            
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                            setConnectionState('listening');
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio) {
                            const audioCtx = outputAudioContextRef.current;
                            if (!audioCtx) return;

                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                            
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioCtx.destination);
                            
                            const startTime = Math.max(nextStartTime.current, audioCtx.currentTime);
                            source.start(startTime);
                            nextStartTime.current = startTime + audioBuffer.duration;

                            outputAudioSources.current.add(source);
                            source.onended = () => {
                                outputAudioSources.current.delete(source);
                            };
                        }

                        if (message.serverContent?.interrupted) {
                            outputAudioSources.current.forEach(source => source.stop());
                            outputAudioSources.current.clear();
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError('An error occurred during the session. Please try again.');
                        cleanup();
                        setConnectionState('error');
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed.');
                        cleanup();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: "You are a knowledgeable and friendly tour guide for Sikkim. Your expertise is in its monasteries, culture, history, and traditions. Respond to questions in a clear, conversational, and engaging manner.",
                },
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (err) {
            console.error('Failed to start session:', err);
            setError('Could not access the microphone. Please grant permission and try again.');
            cleanup();
            setConnectionState('error');
        }
    };

    const getStateInfo = () => {
        switch (connectionState) {
            case 'idle':
                return { text: 'Tap to start talking to the guide', buttonText: 'Start Guide' };
            case 'connecting':
                return { text: 'Connecting to your guide...', buttonText: 'Connecting...' };
            case 'listening':
                return { text: 'Listening... ask me anything about Sikkim!', buttonText: 'Stop Guide' };
            case 'speaking':
                return { text: 'Your guide is speaking...', buttonText: 'Stop Guide' };
            case 'error':
                return { text: error || 'An unknown error occurred.', buttonText: 'Try Again' };
            default:
                return { text: '', buttonText: '' };
        }
    };

    const { text: statusText, buttonText } = getStateInfo();

    return (
        <div className="animate-fade-in container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center min-h-[70vh]">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">Talk to Guide</h1>
                <p className="mt-4 text-lg text-brand-text-secondary">
                    Your personal, voice-activated tour guide for Sikkim. Ask questions and get instant audio responses about culture, monasteries, and more.
                </p>
            </div>

            <div className="mt-12 w-full max-w-2xl flex-grow flex flex-col">
                <div className="bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl shadow-lg p-6 flex-grow flex flex-col">
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                        {transcript.length === 0 && !liveUserTranscript && !liveAiTranscript && connectionState !== 'connecting' && (
                             <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary">
                                <HeadphonesIcon />
                                <p className="mt-2">The conversation transcript will appear here.</p>
                            </div>
                        )}
                        {transcript.map((item, index) => (
                            <div key={index} className={`flex ${item.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-3 rounded-lg ${item.speaker === 'user' ? 'bg-brand-teal text-brand-dark' : 'bg-brand-light-gray text-brand-text'}`}>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}
                        {liveUserTranscript && (
                            <div className="flex justify-end animate-fade-in">
                                <div className="max-w-md p-3 rounded-lg bg-brand-teal text-brand-dark opacity-75">
                                    <p>{liveUserTranscript}</p>
                                </div>
                            </div>
                        )}
                        {liveAiTranscript && (
                             <div className="flex justify-start animate-fade-in">
                                <div className="max-w-md p-3 rounded-lg bg-brand-light-gray text-brand-text opacity-75">
                                    <p>{liveAiTranscript}</p>
                                </div>
                            </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>

                    <div className="mt-6 pt-6 border-t border-brand-light-gray/50 text-center">
                        <p className="h-6 text-brand-text-secondary mb-4">{statusText}</p>
                        <button
                            onClick={handleToggleSession}
                            disabled={connectionState === 'connecting'}
                            className="relative w-24 h-24 bg-brand-teal rounded-full text-brand-dark flex items-center justify-center transition-all duration-300 transform hover:scale-105 disabled:bg-brand-light-gray disabled:cursor-not-allowed shadow-lg"
                            aria-label={buttonText}
                        >
                            {connectionState === 'connecting' ? <SpinnerIcon /> : <MicrophoneIcon />}

                            {(connectionState === 'listening' || connectionState === 'speaking') && (
                                <span className={`absolute inset-0 rounded-full bg-brand-teal/50 -z-10 ${connectionState === 'speaking' ? 'animate-[ping_1.5s_ease-in-out_infinite]' : 'animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]'}`}></span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioGuide;