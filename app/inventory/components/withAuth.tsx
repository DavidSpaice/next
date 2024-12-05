"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import { CircularProgress, Box } from "@mui/material";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        signIn();
      }
    }, [status]);

    if (status === "authenticated") {
      return <WrappedComponent {...props} />;
    }

    // Show a loading spinner while checking authentication
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  };

  return AuthenticatedComponent;
};

export default withAuth;
