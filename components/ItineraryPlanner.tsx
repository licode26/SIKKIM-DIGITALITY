import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon, SpinnerIcon } from './Icons';

declare const DOMPurify: any;
declare const marked: any;

const ItineraryPlanner: React.FC = () => {
    const [days, setDays] = useState('3');
    const [interests, setInterests] = useState<string[]>(['Monasteries']);
    const [pace, setPace] = useState('Relaxed');
    const [isLoading, setIsLoading] = useState(false);
    const [itinerary, setItinerary] = useState('');
    const [error, setError] = useState('');

    const handleInterestChange = (interest: string) => {
        setInterests(prev => 
            prev.includes(interest) 
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const generatePrompt = () => {
        const interestsString = interests.length > 0 ? interests.join(', ') : 'general cultural sites';
        return `You are a travel expert specializing in Sikkim's culture. Create a personalized, ${pace}-paced, ${days}-day itinerary for a tourist visiting Sikkim.
        
        The itinerary should focus on these interests: ${interestsString}.
        
        Please structure your response in Markdown format as follows:
        - Use a main heading for the overall trip title (e.g., "# A 3-Day Cultural Immersion in Sikkim").
        - For each day, use a level 2 heading (e.g., "## Day 1: Spiritual Gangtok").
        - Under each day, provide a bulleted list of 2-3 key places or activities.
        - For each bullet point, provide a brief, engaging, one-sentence description.
        
        Do not include any introductory or concluding paragraphs outside of this structure. Just provide the itinerary.`;
    };

    const handleGenerate = async () => {
        if (interests.length === 0) {
            setError('Please select at least one interest.');
            return;
        }
        setError('');
        setIsLoading(true);
        setItinerary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = generatePrompt();
            
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const textResponse = result.text;
            const unsafeHtml = await marked.parse(textResponse);
            const safeHtml = DOMPurify.sanitize(unsafeHtml);
            setItinerary(safeHtml);

        } catch (e) {
            console.error(e);
            setError('Failed to generate itinerary. The AI might be busy, please try again in a moment.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const interestOptions = ['Monasteries', 'History', 'Festivals', 'Local Life', 'Nature'];

    return (
        <section className="py-20 sm:py-24 bg-brand-gray/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">AI-Powered Itinerary Planner</h2>
                    <p className="mt-4 text-lg text-brand-text-secondary">
                        Craft your perfect cultural journey through Sikkim. Tell our AI your preferences and get a custom travel plan in seconds.
                    </p>
                </div>

                <div className="mt-12 max-w-4xl mx-auto bg-brand-gray/50 backdrop-blur-md border border-brand-light-gray/20 rounded-xl shadow-lg p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Days */}
                        <div>
                            <label htmlFor="days" className="block text-sm font-medium text-brand-text-secondary mb-2">Duration</label>
                            <select id="days" value={days} onChange={e => setDays(e.target.value)} className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-2.5 px-4 text-brand-text focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors">
                                <option value="1">1 Day</option>
                                <option value="3">3 Days</option>
                                <option value="5">5 Days</option>
                                <option value="7">7 Days</option>
                            </select>
                        </div>

                        {/* Pace */}
                        <div>
                            <span className="block text-sm font-medium text-brand-text-secondary mb-2">Travel Pace</span>
                            <div className="flex bg-brand-dark border border-brand-light-gray rounded-lg p-1">
                                <button onClick={() => setPace('Relaxed')} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${pace === 'Relaxed' ? 'bg-brand-teal text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-light-gray/50'}`}>Relaxed</button>
                                <button onClick={() => setPace('Packed')} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${pace === 'Packed' ? 'bg-brand-teal text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-light-gray/50'}`}>Packed</button>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="md:col-span-1">
                             <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 text-base font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 disabled:bg-brand-light-gray disabled:cursor-not-allowed"
                            >
                                {isLoading ? <SpinnerIcon /> : <SparklesIcon />}
                                <span>{isLoading ? 'Generating...' : 'Generate Itinerary'}</span>
                            </button>
                        </div>
                    </div>
                     {/* Interests */}
                    <div className="mt-6">
                        <span className="block text-sm font-medium text-brand-text-secondary mb-3">Interests</span>
                        <div className="flex flex-wrap gap-3">
                            {interestOptions.map(interest => (
                                <button key={interest} onClick={() => handleInterestChange(interest)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${interests.includes(interest) ? 'bg-brand-teal text-brand-dark border-brand-teal' : 'bg-brand-dark/50 border-brand-light-gray text-brand-text-secondary hover:border-brand-teal/50 hover:text-white'}`}>
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && <p className="mt-6 text-center text-red-400">{error}</p>}

                {(isLoading || itinerary) && (
                    <div className="mt-12 max-w-4xl mx-auto">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-gray/50 rounded-xl">
                                <SpinnerIcon />
                                <p className="mt-4 text-brand-text-secondary">Crafting your personalized Sikkim adventure...</p>
                            </div>
                        )}
                        {itinerary && (
                             <div className="bg-brand-gray/50 backdrop-blur-md border border-brand-light-gray/20 rounded-xl shadow-lg p-6 md:p-8">
                                <div 
                                    className="prose prose-invert max-w-none prose-p:text-brand-text-secondary prose-headings:text-white prose-strong:text-brand-text prose-a:text-brand-teal prose-li:marker:text-brand-teal prose-h2:border-b prose-h2:border-brand-light-gray/50 prose-h2:pb-2"
                                    dangerouslySetInnerHTML={{ __html: itinerary }}
                                />
                             </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ItineraryPlanner;
