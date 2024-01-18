import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { saveUserGoogleToDB } from "@/lib/appWrite/api";
import { account } from "@/lib/appWrite/config";
import {
  useCreateUserAccountMutation,
  useGetCurrentUser,
  useGetUsers,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";

import { SignInValidation, SignUpValidation } from "@/lib/validation";
import { INewUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

export const SigninFrom = () => {
  const { toast } = useToast();
  const [showText, setShowText] = useState(false);

  const isLogInWithGoogle = useRef(false);

  const { mutateAsync: signInAccount, isLoading: isSigningIn } =
    useSignInAccount();

  const navigate = useNavigate();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const user = {
      email: values.email,
      password: values.password,
    };

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({ title: "Signin failed, Please try again" });
    }

    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({ title: "Signin failed, Please try again." });
    }
  }
  const handleSignInGoogle = async (e: any) => {
    isLogInWithGoogle.current = false;
    try {
      const session = await account.createOAuth2Session(
        "google",
        "http://localhost:3000/",
        "http://localhost:3000"
      );
      // console.log("Session created", session);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log({ isLogInWithGoogle });
    // async function creatAccountGoogle() {
    //   try {
    //     const session = await account.getSession("current");
    //     console.log({ session });
    //     if (session && session.provider === "google") {
    //       const newUser = await saveUserGoogleToDB();

    //       if (!newUser) {
    //         toast({ title: "Create user failed" });
    //         return;
    //       }
    //       const token = await account.createJWT();

    //       if (token) {
    //         const cookie = localStorage.getItem("cookieFallback");

    //         if (cookie == null || cookie === "[]") {
    //           localStorage.setItem("cookieFallback", token.jwt);
    //         }
    //       }
    //       navigate("/");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // creatAccountGoogle();
  }, []);
  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/img/logo.svg" alt="" />
          <h2 className="h3-bold md:h2-bold bt-5 sm:pt-12">
            Log in to your detail
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            Welcome back , Please enter your detail
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showText ? "text" : "password"}
                      className="shad-input"
                      placeholder="shadcn"
                      {...field}
                    />
                    {showText ? (
                      <i
                        onClick={() => setShowText(!showText)}
                        className="fa-solid fa-eye text-slate-600 translate-y-[-50%] mr-2 cursor-pointer absolute right-0 top-1/2"
                      ></i>
                    ) : (
                      <i
                        onClick={() => setShowText(!showText)}
                        className="fa-solid fa-eye-slash text-slate-600 translate-y-[-50%] mr-2 cursor-pointer absolute right-0 top-1/2"
                      ></i>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don'n hve an account
            <Link
              to={"/sign-up"}
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
      <div
        onClick={(e) => handleSignInGoogle(e)}
        className="shad-button_primary py-[8px] px-[16px] mt-2 rounded-md"
      >
        Sign In with Google
      </div>
    </>
  );
};
