import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const AuthLayout = () => {

  return (
    <div className="w-[100vw] h-full flex lg:px-0 md:px-0 px-0 bg-primary-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Authentication</title>
      </Helmet>
      {/* Left Section */}
      <div className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat bg-black">
        Hey there
      </div>

      {/* Right Section */}
      <section className="flex flex-1 flex-col justify-center items-center bg-primary-100 py-10 px-5 lg:px-20 md:px-10 rounded-md">
        <Outlet />
      </section>
    </div>
  );
};

export default AuthLayout;