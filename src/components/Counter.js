import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Counter.css';  // 引入Counter.css文件

const App = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedCity, setCity] = useState("");
    const [selectedTown, setTown] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const perPage = 10;
    useEffect(() => {
        setIsLoading(true);
        axios.get('https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193')
          .then((response) => {
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / perPage));
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(`Error: ${error}`);
            setIsLoading(false);
          });
      }, []);
    useEffect(() => {
        axios.get('https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193')
          .then((response) => {
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / perPage));
          })
          .catch((error) => console.error(`Error: ${error}`));
      }, []);
    
      // 當 selectedCity 或 selectedTown 改變時，回到第一頁
      useEffect(() => {
        setPage(1);
      }, [selectedCity, selectedTown]);
    
      const filteredData = data.filter(item => 
        (selectedCity ? item.City === selectedCity : true) &&
        (selectedTown ? item.Town === selectedTown : true)
      );
      
      return (
        <div className="container">
        {isLoading ? 
            <div className="loading-cover">
            <div className="loading-icon"></div>
            <p className="loading-text">資料正在載入中，請稍後...</p>

        </div> : null}
       
       
            <header className='top'>
                <h1>農村地方美食小吃特色料理</h1>
            </header>
            <div className="left">
                
                <label className="form-label dropdown">  
                    <select className="styled-select" value={selectedCity} onChange={e => {setCity(e.target.value); setTown("");}}>
                        <option value="">請選擇行政區</option>
                        { [...new Set(data.map(item => item.City))].map(city => <option key={city} value={city}>{city}</option>) }
                    </select>
                </label>
                <label className="form-label dropdown">
                    <select className="styled-select" value={selectedTown} onChange={e => setTown(e.target.value)}>
                        <option value="">請選擇鄉鎮區</option>
                        { selectedCity && [...new Set(data.filter(item => item.City === selectedCity).map(item => item.Town))].map(town => <option key={town} value={town}>{town}</option>) }
                    </select>
                </label> 
                {filteredData && filteredData.slice((page - 1) * perPage, page * perPage).map((item, index) => (
    <div key={index} className="row">
        <div className="card-wrapper">
            <div className='city-town-cord'>
            <div className="city-name-card"> 
                {item.City}
                 </div>
                <div className="town-name-card"> 
                    {item.Town}
                </div>
           
            </div>

            <div className="card">
            <img className="card-img" src={item.PicURL} alt={item.Name} />
                          <div className="content">
                          <h2>
    {item.Url
        ? <a href={item.Url} target="_blank" rel="noopener noreferrer">{item.Name}</a>
        : item.Name
    }
</h2>
                    <p>{item.HostWords.length > 100 ? item.HostWords.substr(0, 100) + '.....' : item.HostWords}</p>
                </div>
               
            </div>
        </div>
  </div>))}              
    <div className="pagination-wrapper">
                    <p className="pagination-text">美食頁次 {page}/{Math.ceil(filteredData.length / perPage)}</p>
                    <div className="pagination-buttons">
                        {Array.from({length: Math.ceil(filteredData.length / perPage)}, (_, index) => 
                            <button className="pagination-button" key={index} onClick={() => setPage(index + 1)}>{index + 1}</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="right">
                <img src="images\adv1.png" alt="1"/>
                <img src="images\adv2.png" alt="2"/>
                <img className="sticky-image" src="images\adv3.png" alt="3" />
            </div>
            <div className="footer">
                <p>資料來源 : 
                    <a href="https://data.gov.tw/dataset/6037" target="_blank" rel="noopener noreferrer">政府資料開放平臺</a>
                </p>
            </div>
          
        </div>
    );
};
export default App;