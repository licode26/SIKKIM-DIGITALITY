import React, { useState, useEffect, useRef } from 'react';

const Counter: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let startTime: number | null = null;
                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        const easedPercentage = easeOutQuint(percentage);

                        setCount(Math.floor(easedPercentage * end));

                        if (progress < duration) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if(currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [end, duration]);

    return <span ref={ref}>{new Intl.NumberFormat().format(count)}</span>;
};

export default Counter;
