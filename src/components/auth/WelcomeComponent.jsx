import React from 'react'
import authImage from '/src/assets/images/auth-image.png';
import ideaImage from '/src/assets/images/idea-image.png';
import wavyBackground from '/src/assets/images/wavy-background-image.png';

const WelcomeComponent = () => {
    return (
        <div
            className="md:flex-1 flex items-center justify-center p-8 relative"
            style={{
                background: `url(${wavyBackground})`,
                backgroundBlendMode: 'overlay',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className='flex relative left-20'>
                <div className="relative top-70 left-7 z-1">
                    <img
                        src={ideaImage}
                        alt="Lightning"
                        className="w-30 h-30 object-contain"
                    />
                </div>

                <div className="bg-[#FFFFFF33] backdrop-blur-3xl rounded-3xl p-8 w-full h-130 max-w-md flex flex-col items-center text-center relative z-0 border-white border-1">
                    <h2 className="text-2xl font-bold leading-tight mb-4 z-2 text-white !mt-5">
                        Very good works are<br /> waiting for you<br /> Login Now!!!
                    </h2>
                </div>
                <div className="w-165 h-110 rounded-3xl overflow-hidden z-1 right-70 top-20 relative">
                    <img
                        src={authImage}
                        alt="Professional Woman"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default WelcomeComponent