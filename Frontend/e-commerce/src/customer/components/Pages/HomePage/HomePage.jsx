import React, { useEffect, useState } from "react";
import MainCorosel from "../../HomeCarosel/MainCorosel";
import HomeSectionCorosel from "../../HomeSectionCorosel/HomeSectionCorosel";
import { api } from "../../../../Config/apiConfig";

const HomePage = () => {
  const [sections, setSections] = useState([]); // { title, products }[]
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Step 1: Fetch category tree
        const { data: tree } = await api.get("/api/categories/tree");

        // Step 2: Build list of all level-3 categories with their path
        const leafCategories = [];
        tree.forEach((l1) => {
          (l1.children || []).forEach((l2) => {
            (l2.children || []).forEach((l3) => {
              leafCategories.push({
                title: `${capitalize(l1.name)} ${capitalize(l3.name)}`,
                path: `${l1.slug}/${l2.slug}/${l3.slug}`,
              });
            });
          });
        });

        // Step 3: Fetch products for each leaf category in parallel
        const results = await Promise.all(
          leafCategories.map(async ({ title, path }) => {
            try {
              const { data } = await api.get(`/api/products/${path}`);
              const products = data?.content || data || [];
              return { title, products };
            } catch {
              return { title, products: [] };
            }
          })
        );

        // Step 4: Fetch featured products
        try {
          const { data } = await api.get("/api/products/featured");
          setFeatured(data || []);
        } catch {
          setFeatured([]);
        }

        // Step 5: Only keep sections that have products
        setSections(results.filter((s) => s.products.length > 0));

      } catch (err) {
        console.error("Failed to load homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
    <div>
      <MainCorosel />

      {loading ? (
        <div className="py-10 px-4 sm:px-6 lg:px-8 space-y-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((c) => (
                  <div key={c} className="w-[15rem] h-[18rem] bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured always first */}
          <HomeSectionCorosel data={featured} sectionTitle="✨ Featured Products" />

          {/* Dynamic sections — only shows categories that have products */}
          {sections.map(({ title, products }) => (
            <HomeSectionCorosel key={title} data={products} sectionTitle={title} />
          ))}

          {/* Nothing to show yet */}
          {sections.length === 0 && featured.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <p className="text-4xl mb-4">🛍️</p>
              <p className="text-lg font-medium">Products coming soon!</p>
              <p className="text-sm mt-1">Check back later for new arrivals.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ") : "";

export default HomePage;