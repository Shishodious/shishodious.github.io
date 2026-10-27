import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import LazySection from "../components/LazySection";
import { findService, rememberService } from "../services/registry";

/** Renders one service world as its ordered list of chapters. */
const ServicePage = () => {
  const { slug } = useParams();
  const service = findService(slug);

  useEffect(() => {
    if (!service) return;
    rememberService(service.slug);
    document.title = `${service.name} — Priyanshu Shishodia`;
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  return (
    <main key={service.slug}>
      {service.chapters.map(({ id, eager, component: Chapter, props }) =>
        eager ? (
          <Chapter key={id} service={service} {...props} />
        ) : (
          <LazySection key={id} anchorId={id}>
            <Chapter service={service} {...props} />
          </LazySection>
        )
      )}
    </main>
  );
};

export default ServicePage;
