import React from 'react';
import MainCorosel from '../../HomeCarosel/MainCorosel';
import HomeSectionCorosel from '../../HomeSectionCorosel/HomeSectionCorosel';
import { 
    menKurtas, 
    menShoes, 
    menShirts, 
    menJeans, 
    womenSarees, 
    womenSweaters 
} from '../../Data/Corouselproducts';

const HomePage = () => {
    return(
        <div>
            <MainCorosel/>
            
            <div className="space-y-8">
                <HomeSectionCorosel 
                    data={menKurtas} 
                    sectionTitle="Men's Kurtas" 
                />
                
                <HomeSectionCorosel 
                    data={menShoes} 
                    sectionTitle="Men's Shoes" 
                />
                
                <HomeSectionCorosel 
                    data={menShirts} 
                    sectionTitle="Men's Shirts" 
                />
                
                <HomeSectionCorosel 
                    data={menJeans} 
                    sectionTitle="Men's Jeans" 
                />
                
                <HomeSectionCorosel 
                    data={womenSarees} 
                    sectionTitle="Women's Sarees" 
                />
                
                <HomeSectionCorosel 
                    data={womenSweaters} 
                    sectionTitle="Women's Sweaters" 
                />
            </div>
        </div>
    )
}

export default HomePage;