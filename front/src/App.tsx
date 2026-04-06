import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./sections/Footer";
import Preloader from "./components/Preloader";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PropertyPage = lazy(() => import("./pages/PropertyPage"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const CollectionNoticePage = lazy(() => import("./pages/CollectionNoticePage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ExpressionOfInterestPage = lazy(
  () => import("./pages/ExpressionOfInterestPage"),
);

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("loaded", loaded);
  }, [loaded]);

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <div>
        <Header ready={loaded} />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage ready={loaded} />} />
            <Route path="/about" element={<AboutPage ready={loaded} />} />
            <Route path="/services" element={<ServicesPage ready={loaded} />} />
            <Route
              path="/testimonials"
              element={<TestimonialsPage ready={loaded} />}
            />
            <Route path="/contact" element={<ContactPage ready={loaded} />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<CollectionNoticePage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/team" element={<TeamPage ready={loaded} />} />
            <Route
              path="/expressions-of-interest"
              element={<ExpressionOfInterestPage ready={loaded} />}
            />
          </Routes>
        </Suspense>
        <Footer ready={loaded} />
      </div>
    </>
  );
}

export default App;
