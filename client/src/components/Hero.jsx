import './Hero.css';
import heroImg from '../assets/hero.png';


export default function Hero() {


    return (
        <div className="hero-section">

            <div className="hero-img-container">
                <img src={heroImg} alt="hero image people with mosaic" />

            </div>

            <h1 className="page-title">
                Share your story to raise funds and support causes you believe in.
            </h1>

            {/* {!user && (
                <span style={{ display: 'block', marginTop: 8, fontSize: '0.8em', color: 'red' }}>
                    Please log in to post or donate.
                </span>
            )} */}

        </div>

    )
}