import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ClientSegments from './components/ClientSegments';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import NewPackages from './components/NewPackages';
import Cases from './components/Cases';
import Testimonials from './components/Testimonials';
import Mission from './components/Mission';
import HowWeDo from './components/HowWeDo';
import Values from './components/Values';
import Geography from './components/Geography';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import News from './components/News';
import Contacts from './components/Contacts';
import Footer from './components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ClientSegments />
      <Services />
      <WhyUs />
      <Packages />
      <Cases />
      <Testimonials />
      <FAQ />
      <ContactForm />
      <News />
      <Contacts />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;