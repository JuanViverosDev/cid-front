import LOGO from '../assets/images/EMCALI-LOADER.png';
export const MainLoader = () => {
  return (
    <div className="parent">
      <div className="heart flex justify-content items-center">
        <img className="w-1/2 mx-auto" src={LOGO} alt="CID - Control Interno Disciplinario" />
      </div>
    </div>
  );
};
