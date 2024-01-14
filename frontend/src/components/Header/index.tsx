import {
  Box,
  Flex,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

import { AuthContext } from "../../contexts/AuthContext";

interface Props {
  children: React.ReactNode;
}

const NavLink = (props: Props) => {
  const { children, href } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={href}
    >
      {children}
    </Box>
  );
};

export function Header() {
  const { signOut } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link href="/dashboard" passHref>
              <Image
                src="/header.png"
                alt="Dashboard"
                width={230}
                height={50}
              />
            </Link>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <NavLink href="/usuario">Usuário</NavLink>
              <NavLink href="/bloco">Bloco</NavLink>
              <NavLink href="/andar">Andar</NavLink>
              <NavLink href="/planta_baixa">Planta Baixa</NavLink>
              <NavLink href="/imagem_campus">Imagem Campus</NavLink>
            </HStack>
          </HStack>
          <button className={styles.botaoSair} onClick={signOut}>
            <FiLogOut color="#000" size={23} />
          </button>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink href="/usuario">Usuário</NavLink>
              <NavLink href="/bloco">Bloco</NavLink>
              <NavLink href="/andar">Andar</NavLink>
              <NavLink href="/planta_baixa">Planta Baixa</NavLink>
              <NavLink href="/imagem_campus">Imagem Campus</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
