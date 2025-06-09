import { Box, Heading, Container } from "@chakra-ui/react";
import USMap from "./USMap";

const MainPage = () => {
  return (
    <Box
      as="main"
      minHeight="100vh"
      bgGradient="linear(to-b, #0a0a0a, #121212)"
      color="cyan.300"
      fontFamily="'Orbitron', sans-serif"
      px={4}
      py={6}
      position="relative"
      overflow="hidden"
    >
      {/* 🔷 Futuristic Grid Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        pointerEvents="none"
        opacity={0.12}
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

      <Container maxW="container.xl" zIndex={1} position="relative" pt={4}>
        <Heading
          as="h2"
          fontSize={{ base: "2xl", md: "4xl" }}
          textAlign="center"
          mb={8}
          textShadow="0 0 6px #00ffff"
        >
          Explore the U.S. Housing Market
        </Heading>

        <Box borderRadius="xl" overflow="hidden" boxShadow="0 0 30px #00ffff88">
          <USMap />
        </Box>
      </Container>
    </Box>
  );
};

export default MainPage;
