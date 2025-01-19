
import './App.css';
import foodBankImage from'./images/food-bank.png'
import megaphoneImage from'./images/megaphone.png'

function App() {
  return (
    <div className="App">
      <div className="landing">
        <div className="landing-left-box"> 
          <h2>Fire Warrior</h2>
          <span>All in 1 website to help you get ready for wildfires & evaculation</span>
        </div>
        <div>
            <div>MAP</div>
            <button>Search Wildfires In The Area</button>
        </div>
      </div>
      <div className="body">
        <div className="row row-one">
            <div className="big-card air style-border">
              <span className="box-title">Air Quality</span>
              <div className="score-box">
                  <span>43</span>
                  <span>Good</span>
                  <div>
                    <p>Health Advisory</p>
                    <span>Air quality is satisfactory. Outdoor activities are safe.</span>
                  </div>
              </div>
            </div>
            <div className="big-card news style-border">
              <span className="box-title">News & Media</span>
              <div className="news-card-wrapper">
                <div className="news-card style-border">
                  <img src={megaphoneImage}></img>
                  <div className="news-info ">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
                <div className="news-card style-border">
                  <img src={megaphoneImage}></img>
                  <div className="news-info">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
                <div className="news-card style-border">
                  <img src={megaphoneImage}></img>
                  <div className="news-info">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
                <div className="news-card style-border">
                  <img src={megaphoneImage}></img>
                  <div className="news-info">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="row row-two">
            <div className="big-card food-bank style-border">
              <span className="box-title">Food Banks</span>
              <div className="small-card-wrapper">
                <div className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage}></img>
                  <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 
                  8:00 AM - 2:00 PM</span>
                </div>
                <div className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage}></img>
                  <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 
                  8:00 AM - 2:00 PM</span>
                </div>
              
              </div>
            </div>
        </div>
        <div className="row row-three">
          <div className="big-card hospital style-border">
              <span className="box-title">Hospitals & Shelters</span>
              <div className="small-card-wrapper hospital">
                <div className="small-card style-border">
                    <span>Kamloops Food Bank</span>
                    <img src={foodBankImage}></img>
                    <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                    <span>Phone: +1 250-376-2252</span>
                    <span>Hours: Mon-Fri: 
                    8:00 AM - 2:00 PM</span>
                </div>
                <div className="small-card style-border">
                    <span>Kamloops Food Bank</span>
                    <img src={foodBankImage}></img>
                    <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                    <span>Phone: +1 250-376-2252</span>
                    <span>Hours: Mon-Fri: 
                    8:00 AM - 2:00 PM</span>
                </div>
                <div className="small-card style-border">
                    <span>Kamloops Food Bank</span>
                    <img src={foodBankImage}></img>
                    <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                    <span>Phone: +1 250-376-2252</span>
                    <span>Hours: Mon-Fri: 
                    8:00 AM - 2:00 PM</span>
                </div>
                <div className="small-card style-border">
                    <span>Kamloops Food Bank</span>
                    <img src={foodBankImage}></img>
                    <span>Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada</span>
                    <span>Phone: +1 250-376-2252</span>
                    <span>Hours: Mon-Fri: 
                    8:00 AM - 2:00 PM</span>
                </div>
              </div>
            </div>
        </div>
        <div className="row row-four style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
