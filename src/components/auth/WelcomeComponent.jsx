import authImage from "/src/assets/images/auth-image.png";
import ideaImage from "/src/assets/images/idea-image.png";
import wavyBackground from "/src/assets/images/wavy-background-image.png";

const WelcomeComponent = () => {
  return (
    <div
      className="xl:w-1/2 lg:w-1/2 hidden md:hidden sm:hidden xl:flex xl:items-center xl:justify-center !p-6 xl:p-0 lg:flex lg:items-center lg:justify-center"
      style={{
        backgroundImage: `url(${wavyBackground})`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 absolute xl:top-[27rem] xl:left-[11.2rem] lg:top-[28rem] lg:left-[3.8rem] sm:top-[20rem] sm:left-[11.2rem] md:top-[38rem] md:left-[0.3rem] top-[22rem] left-[0.2rem]">
        <img
          src={ideaImage}
          alt="Lightning"
          className="w-[2.5rem] h-[2.5rem] xl:w-[3.5rem] xl:h-[3.5rem] object-contain"
        />
      </div>
      <div className="bg-white/20 backdrop-blur-3xl rounded-[1.5rem] xl:w-[22rem] w-full sm:w-[22rem] sm:h-[30rem] h-[32rem] text-center border border-white !p-6">
        <h2 className="uppercase text-xl font-bold leading-tight text-white">
          <span className="block">Very good works are</span>
          <span className="block">waiting for you</span>
          <span className="block">Login Now!!</span>
        </h2>
      </div>
      <div
        className="w-full max-w-[22rem] rounded-[1.5rem] overflow-hidden
                        xl:w-[40.25rem] xl:h-[26rem]
                        absolute z-20 xl:left-[16.8rem] xl:top-[11.8rem] lg:left-[9.5rem] lg:top-[16.8rem] sm:left-[17rem] sm:top-[9.2rem] md:left-[2.5rem] md:top-[25rem] xl:z-10 top-[11.5rem] left-[3.5rem]"
      >
        <img
          src={authImage}
          alt="Professional Woman"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default WelcomeComponent;
