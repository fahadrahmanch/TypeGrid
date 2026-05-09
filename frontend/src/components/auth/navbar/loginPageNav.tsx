import Logo from "../../../assets/Icon/logo.png";
const LoginNavbar: React.FC = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 left-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="TypeGrid Logo" className="h-10 w-auto" />
        <h1 className="text-2xl font-bold font-jaini text-gray-900 mt-1">TypeGrid</h1>
      </div>
    </nav>
  );
};
export default LoginNavbar;
