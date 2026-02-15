import React, { useEffect, useState } from "react";
import MainCorosel from "../../HomeCarosel/MainCorosel";
import HomeSectionCorosel from "../../HomeSectionCorosel/HomeSectionCorosel";
import { api } from "../../../../Config/apiConfig";

const HomePage = () => {
  const [menKurtas, setMenKurtas] = useState([]);
  const [menShirts, setMenShirts] = useState([]);
  const [menJeans, setMenJeans] = useState([]);
  const [menShoes, setMenShoes] = useState([]);

  const [womenSarees, setWomenSarees] = useState([]);
  const [womenSweaters, setWomenSweaters] = useState([]);

  // lifestyle
  const [artifacts, setArtifacts] = useState([]);
  const [candles, setCandles] = useState([]);
  const [bags, setBags] = useState([]);
  const [homeDecor, setHomeDecor] = useState([]);

  const [loading, setLoading] = useState(true);

const fetchProducts = async (first, second, third, setterFn) => {
  try {
    const { data } = await api.get(
      `/api/products/${first}/${second}/${third}`
    );
    setterFn(data || []);
  } catch (err) {
    console.log(`Error fetching ${third}:`, err);
    setterFn([]);
  }
};


  useEffect(() => {
    const loadAll = async () => {
      try {
await Promise.all([
  // Men
  fetchProducts("men", "clothing", "kurtas", setMenKurtas),
  fetchProducts("men", "clothing", "shirts", setMenShirts),
  fetchProducts("men", "clothing", "jeans", setMenJeans),
  fetchProducts("men", "footwear", "shoes", setMenShoes),

  // Women
  fetchProducts("women", "clothing", "sarees", setWomenSarees),
  fetchProducts("women", "clothing", "sweaters", setWomenSweaters),

  // Lifestyle
  fetchProducts("lifestyle", "decor", "artifacts", setArtifacts),
  fetchProducts("lifestyle", "decor", "candles", setCandles),
  fetchProducts("lifestyle", "decor", "bags", setBags),
  fetchProducts("lifestyle", "decor", "home-decor", setHomeDecor),
]);

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
        // 🔹 Simple skeleton loader while data is fetched
        <div className="py-10 px-4 sm:px-6 lg:px-8 space-y-8">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((card) => (
                  <div
                    key={card}
                    className="w-[15rem] h-[18rem] bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <HomeSectionCorosel data={menKurtas} sectionTitle="Men's Kurtas" />
          <HomeSectionCorosel data={menShirts} sectionTitle="Men's Shirts" />
          <HomeSectionCorosel data={menJeans} sectionTitle="Men's Jeans" />
          <HomeSectionCorosel data={menShoes} sectionTitle="Men's Shoes" />

          <HomeSectionCorosel data={womenSarees} sectionTitle="Women's Sarees" />
          <HomeSectionCorosel
            data={womenSweaters}
            sectionTitle="Women's Sweaters"
          />

          <HomeSectionCorosel data={artifacts} sectionTitle="Artifacts" />
          <HomeSectionCorosel data={candles} sectionTitle="Candles" />
          <HomeSectionCorosel data={bags} sectionTitle="Bags" />
          <HomeSectionCorosel data={homeDecor} sectionTitle="Home Decor" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
