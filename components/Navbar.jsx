"use client";
import { Button } from "./ui/button";
import { SiAmazondocumentdb } from "react-icons/si";
import { UserButton } from "@clerk/nextjs";
import { FiFolderPlus } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/images/logo1.png";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  return (
    <nav className="h-[64px] shadow-md px-4 flex items-center">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link className="flex items-center justify-center gap-2" href="/">
          {" "}
          <p className="text-2xl font-bold">McVault</p>{" "}
          <SiAmazondocumentdb size={35} />
        </Link>
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="Mccoin Logo" />
        </div>
        <ul className="flex gap-4 items-center">
          <li className="flex items-center">
            <Button className="cursor-pointer" disabled={!isSignedIn} onClick={()=>router.push('/add')} variant="outline">
              <FiFolderPlus
                size={40}
                color="green"
                
              />
            </Button>
          </li>
        </ul>
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
