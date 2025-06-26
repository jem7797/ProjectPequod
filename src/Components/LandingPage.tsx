import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  Container,
} from "@chakra-ui/react";
import { Link } from "react-router";
import "../Styling/fonts.css";

const LandingPage = () => {
  return (
    <Box
      as="main"
      minHeight="100vh"
      bgGradient="linear(to-b, #0a0a0a, #121212)"
      color="cyan.300"
      fontFamily="'Orbitron', sans-serif"
      px={6}
      py={10}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Sharp grid overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        pointerEvents="none"
        opacity={0.2}
        bgImage={`
  repeating-linear-gradient(
    to right,
    rgba(0, 255, 255, 0.6),
    rgba(0, 255, 255, 0.6) 1px,
    transparent 1px,
    transparent 40px
  ),
  repeating-linear-gradient(
    to bottom,
    rgba(0, 255, 255, 0.6),
    rgba(0, 255, 255, 0.6) 1px,
    transparent 1px,
    transparent 40px
  )
`}
        bgSize="40px 40px"
        zIndex={0}
      />

      <Container
        maxW="container.md"
        position="relative"
        zIndex={1}
        textAlign="center"
      >
        <Heading
          as="h1"
          fontSize={{ base: "3xl", md: "7xl" }}
          mb={12} // bigger gap here
          textShadow="0 0 8px #00ffff"
          fontFamily={"audiowide"}
        >
          Project Pequod 
        </Heading>

        <Text
          fontSize={{ base: "md", md: "xl" }}
          mb={10}
          textShadow="0 0 6px #00ffff"
          maxW="600px"
          mx="auto"
          lineHeight="1.5"
          fontFamily={"audiowide"}
        >
          Predict home prices with our advance ML model named Ahab who was trained on gigabytes of
          up-to-date data — because if you’re buying Earth, you should know it’s
          worth.
        </Text>

        <VStack spacing={6} align="center">
          <Link to={"/main-page"}>
            <Button
              size="lg"
              colorScheme="cyan"
              variant="outline"
              borderWidth="2px"
              _hover={{
                bg: "cyan.400",
                color: "black",
                boxShadow: "0 0 20px cyan",
                borderColor: "cyan.400",
              }}
              _active={{
                bg: "cyan.600",
                boxShadow: "0 0 30px cyan",
                color: "white",
              }}
                        fontFamily={"audiowide"}

            >
              Start Predicting
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;
