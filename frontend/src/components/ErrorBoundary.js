import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Container } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Container maxW="xl" centerContent margin="auto">
      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="390px"
        bg="purple.800"
        color="yellow.300"
        borderRadius="16px"
        borderWidth="2px"
        borderColor="black"
      >
        <AlertIcon boxSize="40px" mr={0} color="white" />
        <AlertTitle mt={4} mb={1} fontSize="2xl">
          Your chats 📥 are Loading ⌛
        </AlertTitle>
        <Spinner
          m={4}
          thickness="6px"
          speed="0.99s"
          emptyColor="gray.200"
          color="yellow.400"
          size="xl"
        />
        <AlertDescription  maxWidth="sm" color="white">
          ( Still ⌛..Click on the Button Below ⬇️ )
        </AlertDescription>
        <Button
          variant="ghost"
          bg="yellow.300"
          mt={6}
          color="black"
          borderColor="black"
          onClick={resetErrorBoundary}
          _hover={{ background: "green.500", color: "white" }}
          _active={{ background: "green.500", color: "white" }}
        >
          Continue Texting ➡️
        </Button>
      </Alert>
    </Container>
  );
}

export default ErrorFallback;
