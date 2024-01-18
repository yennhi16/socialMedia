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
import {
  useCreateUserAccountMutation,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";

import { SignUpValidation } from "@/lib/validation";
import { INewUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

export const SignupForm = () => {
  const { toast } = useToast();
  const [showText, setShowText] = useState(false);
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } =
    useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isLoading: isSigningIn } =
    useSignInAccount();

  const navigate = useNavigate();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const user: INewUser = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    };
    const newUser = await createUserAccount(user);
    // console.log("newUser: " + newUser);
    if (!newUser) {
      toast({
        title: "Signup failed, Please try again",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    console.log("session", session);
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
  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/img/logo.svg" alt="" />
          <h2 className="h3-bold md:h2-bold bt-5 sm:pt-12">
            Create new account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            To use Snapgram enter detail
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to={"/sign-in"}
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};
