import Logo from '../../../assets/Icon/logo.png'
const LoginNavbar:React.FC=()=>{
    return (
      <>
      <nav className="bg-white flex justify-between items-center w-full p-4 fixed top-0 left-0 z-50">
      <h1 className="text-[25px] font-bold font-jaini top-2 fixed">TypeGrid</h1>
        <img src={Logo} className='h-12 left-3 top-3 relative'/>
    </nav>
      </>
    )
}
export default LoginNavbar