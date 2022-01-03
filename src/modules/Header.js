import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as RouterLink } from "react-router-dom"
import { useHistory } from 'react-router';
import { apiUrl } from '../helpers/apiUrl';
import auth from "../services/Auth";

import axios from '../interceptors/auth.interceptor';

export default function Header(props) {
  const history = useHistory();

  const { isOpen, onToggle } = useDisclosure();

  const [mainMenuItems, setMainMenuItems] = useState([]);

  useEffect(() => {
    axios.get(apiUrl + "/api/site/main-menu/getMainMenuItems",{userId: "60e1ca28a452c928d898d85e"})
      .then(res => {
        console.log(res);
        if(res.data){
          setMainMenuItems(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    auth.logout(() => {
      history.go(0);
    });
  };


  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            Logo
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav mainMenuItems={mainMenuItems} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {auth.isAuthenticated() ? (<Button
            fontSize={'sm'}
            fontWeight={500}
            onClick={logout}
            bg={'gray.300'}>
            Logout
          </Button>) : (<Button
            as={RouterLink}
            fontSize={'sm'}
            fontWeight={400}
            to={'/login'}>
            Sign In
          </Button>)}
          {/* <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'teal.400'}
            href={'#'}
            _hover={{
              bg: 'teal.300',
            }}>
            Sign Up
          </Button> */}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav mainMenuItems={mainMenuItems} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = (props) => {
  const { mainMenuItems } = props;
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {mainMenuItems.map((navItem) => {
        if (navItem.typeArticle) {
          navItem.urlPath = `/articles/${navItem.typeArticle._id}`;
        } else {
          navItem.urlPath = '#'
        }
        return (<Box key={navItem._id}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                p={2}
                to={navItem.urlPath}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.name}
              </Link>
            </PopoverTrigger>

            {navItem.typeDropDown.length > 0 && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.typeDropDown.map((child) => {
                    if (child.typeArticle) {
                      child.urlPath = `/articles/${child.typeArticle}`;
                    } else {
                      child.urlPath = '';
                    }
                    return (<DesktopSubNav key={child._id} {...child} />)
                  })}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>);
      })}
    </Stack>
  );
};

const DesktopSubNav = (child) => {
  return (
    <Link
      as={RouterLink}
      to={child.urlPath}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {child.name}
          </Text>
          {/* <Text fontSize={'sm'}>{child.name}</Text> */}
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = (props) => {
  const { mainMenuItems } = props;
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {mainMenuItems.map((navItem) => {
        if (navItem.typeArticle) {
          navItem.urlPath = `/articles/${navItem.typeArticle._id}`;
        } else {
          navItem.urlPath = '#'
        }
        return (<MobileNavItem key={navItem._id} {...navItem} />);
      })}
    </Stack>
  );
};

const MobileNavItem = (navItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={`${navItem.urlPath}`}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {navItem.name}
        </Text>
        {navItem.typeDropDown.length > 0 && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {/* {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))} */}
          {navItem.typeDropDown.length > 0 && (
            navItem.typeDropDown.map((child) => {
              return (<Link as={RouterLink} key={child._id} py={2} to={`/articles/${child._id}`}>
                {child.name}
              </Link>)
            })
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
};

//   interface NavItem {
//     label: string;
//     subLabel?: string;
//     children?: Array<NavItem>;
//     href?: string;
//   }

// const NAV_ITEMS = [
//   {
//     label: 'Inspiration',
//     children: [
//       {
//         label: 'Explore Design Work',
//         subLabel: 'Trending Design to inspire you',
//         href: '#',
//       },
//       {
//         label: 'New & Noteworthy',
//         subLabel: 'Up-and-coming Designers',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Find Work',
//     children: [
//       {
//         label: 'Job Board',
//         subLabel: 'Find your dream design job',
//         href: '#',
//       },
//       {
//         label: 'Freelance Projects',
//         subLabel: 'An exclusive list for contract work',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Learn Design',
//     href: '#',
//   },
//   {
//     label: 'Hire Designers',
//     href: '#',
//   },
// ];