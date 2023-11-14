// global da aplicação
import '../../styles/globals.scss'
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
        <Component {...pageProps} />
        <ToastContainer limit={5} autoClose={3000} />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
