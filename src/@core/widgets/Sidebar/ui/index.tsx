"use client";
import { adminlinks, userlinks } from "@/@core/application/helper/links";
import { scssVariables } from "@/@core/application/utils/vars";
import { Link } from "@/navigation";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useLang } from "@/@core/shared/hook/useLang";
import { usePathname } from "next/navigation";
import Cookie from "js-cookie";

type Props = {};

export const Sidebar: FC<Props> = (props) => {
  const { locale } = useLang();
  const pathname = usePathname();
  const [role, setRole] = useState<any>();

  useEffect(() => {
    const roleUser = Cookie.get("role");
    if (roleUser) setRole(roleUser);
  }, []);

  return (
    <Box
      display={{ base: "none", sm: "block", md: "block", xl: "block" }}
      w={{ base: "0", sm: "70px", md: "324px", xl: "324px" }}
      transition={"width 0.3s linear"}
      h={"100%"}
      maxH={"100dvh"}
      bg={scssVariables.primary}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.10)"}
    >
      <Flex
        alignItems={"center"}
        bg={"#fff"}
        h={"70px"}
        mb={{ sm: "10px", md: "20px", xl: "20px" }}
      >
        <img
          src="/logo.webp"
          alt="logo"
          loading="lazy"
          width={74}
          height={74}
        />
        <Text
          color={"#252525"}
          fontSize={{ base: "0", sm: "13px", md: "14px", xl: "14px" }}
          fontWeight={500}
        >
          Ўзбекистон техник жиҳатдан тартибга солиш агентлиги
        </Text>
      </Flex>
      <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
        {String(role) === "admin"
          ? adminlinks.map((link) => (
              <Accordion key={link.id} allowMultiple>
                <AccordionItem border={"none"}>
                  <AccordionButton
                    as={Link}
                    href={link.href}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={{
                      base: "none",
                      sm: "center",
                      md: "space-between",
                    }}
                    color={"#fff"}
                    fontSize={scssVariables.fonts.span}
                    className={`${
                      pathname == `/${locale}${link.href}` ? "active" : ""
                    }`}
                  >
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={"10px"}
                    >
                      <Icon
                        as={link.icon}
                        color={"#fff"}
                        w={"18px"}
                        h={"18px"}
                      />
                      <Text display={{ sm: "none", md: "flex", xl: "flex" }}>
                        {link.title}
                      </Text>
                    </Box>
                    {link.subMenu && <AccordionIcon />}
                  </AccordionButton>
                  {link.subMenu &&
                    link.subMenu.map((subLink) => (
                      <AccordionPanel
                        key={subLink.id}
                        p={"0"}
                        className={`${
                          pathname == `/${locale}${subLink.href}`
                            ? "active"
                            : ""
                        }`}
                      >
                        <Button
                          w={"100%"}
                          as={Link}
                          href={subLink.href}
                          bg={"none"}
                          _hover={{ bg: "rgba(0,0,0,0.05)" }}
                          color={"lightgrey"}
                          borderRadius={"0"}
                          h={"35px"}
                          fontSize={scssVariables.fonts.span}
                        >
                          <Box
                            w={"100%"}
                            display={"flex"}
                            alignItems={"center"}
                            gap={"10px"}
                          >
                            <Icon
                              as={subLink.icon}
                              color={"#fff"}
                              w={"12px"}
                              h={"12px"}
                            />
                            <Text>{subLink.title}</Text>
                          </Box>
                        </Button>
                      </AccordionPanel>
                    ))}
                </AccordionItem>
              </Accordion>
            ))
          : userlinks.map((link) => (
              <Accordion key={link.id} allowMultiple>
                <AccordionItem border={"none"}>
                  <AccordionButton
                    as={Link}
                    href={link.href}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={{
                      base: "none",
                      sm: "center",
                      md: "space-between",
                    }}
                    color={"#fff"}
                    fontSize={scssVariables.fonts.span}
                    className={`${
                      pathname == `/${locale}${link.href}` ? "active" : ""
                    }`}
                  >
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={"10px"}
                    >
                      <Icon
                        as={link.icon}
                        color={"#fff"}
                        w={"18px"}
                        h={"18px"}
                      />
                      <Text display={{ sm: "none", md: "flex", xl: "flex" }}>
                        {link.title}
                      </Text>
                    </Box>
                    {link.subMenu && <AccordionIcon />}
                  </AccordionButton>
                  {link.subMenu &&
                    link.subMenu.map((subLink) => (
                      <AccordionPanel
                        key={subLink.id}
                        p={"0"}
                        className={`${
                          pathname == `/${locale}${subLink.href}`
                            ? "active"
                            : ""
                        }`}
                      >
                        <Button
                          w={"100%"}
                          as={Link}
                          href={subLink.href}
                          bg={"none"}
                          _hover={{ bg: "rgba(0,0,0,0.05)" }}
                          color={"lightgrey"}
                          borderRadius={"0"}
                          h={"35px"}
                          fontSize={scssVariables.fonts.span}
                        >
                          <Box
                            w={"100%"}
                            display={"flex"}
                            alignItems={"center"}
                            gap={"10px"}
                          >
                            <Icon
                              as={subLink.icon}
                              color={"#fff"}
                              w={"12px"}
                              h={"12px"}
                            />
                            <Text>{subLink.title}</Text>
                          </Box>
                        </Button>
                      </AccordionPanel>
                    ))}
                </AccordionItem>
              </Accordion>
            ))}
      </Box>
    </Box>
  );
};
