
import './App.css';

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
            <div className="big-card style-border">
              <p className="box-title">Air Quality</p>
            </div>
            <div className="big-card style-border">
              <p className="box-title">News & Media</p>
            </div>
        </div>
        <div className="row row-two style-border">
            <div className="big-card style-border">
              <span className="box-title">Food Banks</span>
              <div className="small-card style-border">
                <span>title</span>
                <span>Address</span>
                <span>Phone</span>
                <span>Hour</span>
              </div>
              <div className="small-card style-border">
                <span>title</span>
                <span>Address</span>
                <span>Phone</span>
                <span>Hour</span>
              </div>
            </div>
            <div className="big-card style-border">
              <span className="box-title">Hospitals & Shelters</span>
            </div>
        </div>
        <div className="row row-three style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
