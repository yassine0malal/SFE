
import React, { useState, useEffect, useRef } from 'react';

const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

const IntegratedEmailSystem = () => {
  // Email system states
  const [emailList, setEmailList] = useState([]);
  const [phoneList, setPhoneList] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  
  // Message editing states
  const [customHtml, setCustomHtml] = useState(`
    <div class="email-container">
      <h1 class="title">Welcome to Our Newsletter</h1>
      <p class="text">Thank you for subscribing to our newsletter. We're excited to share our latest updates with you.</p>
      <button class="btn">Visit Our Website</button>
    </div>
    <style>
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }
      .title {
        color: white;
        font-size: 28px;
        text-align: center;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        font-weight: bold;
      }
      .text {
        color: #f8f9fa;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 25px;
        text-align: center;
      }
      .btn {
        display: block;
        margin: 0 auto;
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s ease;
        text-decoration: none;
      }
      .btn:hover {
        background: #ff5252;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
      }
    </style>
  `);
  
  // Preview functionality
  const previewRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Template examples
  const templateExamples = [
    {
      name : "Welcome Email",
      content : `
      <div class="email-container">
      <h1 class="title">Welcome to Our Newsletter</h1>
      <p class="text">Thank you for subscribing to our newsletter. We're excited to share our latest updates with you.</p>
      <button class="btn">Visit Our Website</button>
    </div>
    <style>
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        font-family: 'Arial', sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }
      .title {
        color: white;
        font-size: 28px;
        text-align: center;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        font-weight: bold;
      }
      .text {
        color: #f8f9fa;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 25px;
        text-align: center;
      }
      .btn {
        display: block;
        margin: 0 auto;
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s ease;
        text-decoration: none;
      }
      .btn:hover {
        background: #ff5252;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
      }
    </style>`
    },
    {
      name: "Newsletter",
      content: `
        <div class="newsletter">
          <header class="header">
            <h1>Monthly Newsletter</h1>
            <p class="date">December 2024</p>
          </header>
          <div class="content">
            <h2>What's New This Month</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
            <a href="#" class="cta-btn">Read More</a>
          </div>
        </div>
        <style>
          .newsletter {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(45deg, #4f46e5, #7c3aed);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .date {
            margin: 0;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .content h2 {
            color: #374151;
            margin-bottom: 15px;
          }
          .content p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .cta-btn {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.3s;
          }
          .cta-btn:hover {
            background: #059669;
          }
        </style>
      `
    },
    {
      name: "Promotion",
      content: `
        <div class="promo-card">
          <div class="promo-header">
            <span class="discount">50% OFF</span>
            <h1>Special Offer!</h1>
          </div>
          <div class="promo-body">
            <p>Don't miss out on our biggest sale of the year. Get 50% off on all products.</p>
            <div class="countdown">
              <span>Limited Time Only!</span>
            </div>
            <button class="shop-btn">Shop Now</button>
          </div>
        </div>
        <style>
          .promo-card {
            max-width: 500px;
            margin: 0 auto;
            background: linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%);
            border-radius: 20px;
            color: white;
            overflow: hidden;
            position: relative;
          }
          .promo-header {
            text-align: center;
            padding: 40px 20px 20px;
            position: relative;
          }
          .discount {
            background: #fff;
            color: #ff6b95;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 15px;
          }
          .promo-header h1 {
            margin: 0;
            font-size: 32px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .promo-body {
            padding: 20px 30px 40px;
            text-align: center;
          }
          .promo-body p {
            font-size: 16px;
            margin-bottom: 20px;
            opacity: 0.95;
          }
          .countdown {
            background: rgba(255,255,255,0.2);
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 25px;
            font-weight: bold;
          }
          .shop-btn {
            background: white;
            color: #ff6b95;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .shop-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255,255,255,0.3);
          }
        </style>
      `
    },
    {
      name: "Welcome",
      content: `
        <div class="welcome-container">
          <div class="welcome-header">
            <div class="icon">👋</div>
            <h1>Welcome Aboard!</h1>
          </div>
          <div class="welcome-content">
            <p>We're thrilled to have you join our community. Get ready for an amazing journey ahead!</p>
            <div class="features">
              <div class="feature">
                <span class="feature-icon">✨</span>
                <span>Exclusive Content</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🎯</span>
                <span>Personalized Experience</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🚀</span>
                <span>Early Access</span>
              </div>
            </div>
            <button class="get-started-btn">Get Started</button>
          </div>
        </div>
        <style>
          .welcome-container {
            max-width: 550px;
            margin: 0 auto;
            background: #f8fafc;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid #e2e8f0;
          }
          .welcome-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .icon {
            font-size: 48px;
            margin-bottom: 15px;
          }
          .welcome-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .welcome-content {
            padding: 30px;
          }
          .welcome-content p {
            color: #475569;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            text-align: center;
          }
          .features {
            margin-bottom: 30px;
          }
          .feature {
            display: flex;
            align-items: center;
            padding: 10px 0;
            color: #374151;
          }
          .feature-icon {
            margin-right: 12px;
            font-size: 18px;
          }
          .get-started-btn {
            width: 100%;
            background: #10b981;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
          }
          .get-started-btn:hover {
            background: #059669;
          }
        </style>
      `
    },
  {
    name: "Event Invitation",
    content: `
      <div class="event-invitation">
        <div class="event-header">
          <div class="date-badge">
            <span class="day">15</span>
            <span class="month">DEC</span>
          </div>
          <h1>Vous êtes invité !</h1>
        </div>
        <div class="event-details">
          <h2>Soirée de Fin d'Année</h2>
          <div class="info-row">
            <span class="icon">📍</span>
            <span>Grand Hôtel Central</span>
          </div>
          <div class="info-row">
            <span class="icon">⏰</span>
            <span>19h00 - 02h00</span>
          </div>
          <div class="info-row">
            <span class="icon">👔</span>
            <span>Tenue de soirée exigée</span>
          </div>
          <button class="rsvp-btn">Confirmer ma présence</button>
        </div>
      </div>
      <style>
        .event-invitation {
          max-width: 480px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .event-header {
          padding: 30px;
          text-align: center;
          position: relative;
        }
        .date-badge {
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 15px;
          display: inline-block;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        .day {
          display: block;
          font-size: 24px;
          font-weight: bold;
        }
        .month {
          display: block;
          font-size: 12px;
          opacity: 0.8;
        }
        .event-header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 300;
        }
        .event-details {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          backdrop-filter: blur(10px);
        }
        .event-details h2 {
          margin: 0 0 25px 0;
          font-size: 22px;
          text-align: center;
        }
        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .icon {
          margin-right: 12px;
          font-size: 18px;
        }
        .rsvp-btn {
          width: 100%;
          background: #ff6b95;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        .rsvp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 149, 0.4);
        }
      </style>
    `
  },
  {
    name: "Product Launch",
    content: `
      <div class="product-launch">
        <div class="launch-header">
          <div class="badge">NOUVEAU</div>
          <h1>Découvrez notre dernière innovation</h1>
          <p class="subtitle">Révolutionnez votre quotidien</p>
        </div>
        <div class="product-image">
          <div class="placeholder-img">📱</div>
        </div>
        <div class="product-info">
          <h2>SmartDevice Pro</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <span>Ultra rapide</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <span>Sécurisé</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌟</div>
              <span>Premium</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💎</div>
              <span>Élégant</span>
            </div>
          </div>
          <div class="price-section">
            <span class="old-price">299€</span>
            <span class="new-price">199€</span>
          </div>
          <button class="preorder-btn">Précommander maintenant</button>
        </div>
      </div>
      <style>
        .product-launch {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .launch-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .badge {
          background: #fbbf24;
          color: #1f2937;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
        }
        .launch-header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .product-image {
          padding: 40px;
          text-align: center;
          background: #f8fafc;
        }
        .placeholder-img {
          font-size: 80px;
          opacity: 0.7;
        }
        .product-info {
          padding: 30px;
        }
        .product-info h2 {
          text-align: center;
          color: #1f2937;
          margin-bottom: 25px;
          font-size: 24px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f1f5f9;
          border-radius: 12px;
        }
        .feature-icon {
          margin-right: 10px;
          font-size: 20px;
        }
        .price-section {
          text-align: center;
          margin-bottom: 25px;
        }
        .old-price {
          color: #9ca3af;
          text-decoration: line-through;
          margin-right: 15px;
          font-size: 18px;
        }
        .new-price {
          color: #dc2626;
          font-size: 32px;
          font-weight: bold;
        }
        .preorder-btn {
          width: 100%;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .preorder-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
        }
      </style>
    `
  },
  {
    name: "Thank You",
    content: `
      <div class="thank-you-card">
        <div class="gratitude-header">
          <div class="heart-icon">💝</div>
          <h1>Merci beaucoup !</h1>
        </div>
        <div class="message-content">
          <p>Votre soutien signifie énormément pour nous. Grâce à vous, nous pouvons continuer à grandir et à vous offrir le meilleur service possible.</p>
          <div class="appreciation-stats">
            <div class="stat-item">
              <span class="stat-number">1,247</span>
              <span class="stat-label">Clients satisfaits</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">4.9</span>
              <span class="stat-label">Note moyenne</span>
            </div>
          </div>
          <div class="next-steps">
            <h3>Prochaines étapes :</h3>
            <div class="step">
              <span class="step-number">1</span>
              <span>Confirmez votre email</span>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <span>Explorez nos services</span>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <span>Rejoignez notre communauté</span>
            </div>
          </div>
          <button class="continue-btn">Continuer l'aventure</button>
        </div>
      </div>
      <style>
        .thank-you-card {
          max-width: 520px;
          margin: 0 auto;
          background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(252, 211, 77, 0.3);
        }
        .gratitude-header {
          text-align: center;
          padding: 40px 30px 20px;
          background: rgba(255,255,255,0.2);
        }
        .heart-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }
        .gratitude-header h1 {
          margin: 0;
          color: #92400e;
          font-size: 28px;
          font-weight: 700;
        }
        .message-content {
          padding: 20px 30px 40px;
        }
        .message-content p {
          color: #78350f;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 25px;
          text-align: center;
        }
        .appreciation-stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          background: rgba(255,255,255,0.3);
          border-radius: 15px;
          padding: 20px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #92400e;
        }
        .stat-label {
          font-size: 12px;
          color: #a16207;
          text-transform: uppercase;
        }
        .next-steps h3 {
          color: #92400e;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .step {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          color: #78350f;
        }
        .step-number {
          background: #92400e;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 12px;
        }
        .continue-btn {
          width: 100%;
          background: #92400e;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
        }
        .continue-btn:hover {
          background: #78350f;
          transform: translateY(-2px);
        }
      </style>
    `
  },
  {
    name: "Survey Request",
    content: `
      <div class="survey-card">
        <div class="survey-header">
          <div class="feedback-icon">📊</div>
          <h1>Votre avis compte !</h1>
          <p>Aidez-nous à nous améliorer</p>
        </div>
        <div class="survey-body">
          <div class="intro-text">
            <p>Nous aimerions connaître votre expérience avec nos services. Votre feedback nous aide à offrir une meilleure expérience à tous nos utilisateurs.</p>
          </div>
          <div class="survey-incentive">
            <div class="reward-badge">🎁</div>
            <div class="reward-text">
              <strong>Récompense exclusive :</strong><br>
              Recevez 20% de réduction sur votre prochain achat
            </div>
          </div>
          <div class="time-estimate">
            <span class="clock-icon">⏱️</span>
            <span>Seulement 2 minutes</span>
          </div>
          <div class="rating-preview">
            <p>Comment évalueriez-vous notre service ?</p>
            <div class="stars">
              <span class="star">⭐</span>
              <span class="star">⭐</span>
              <span class="star">⭐</span>
              <span class="star">⭐</span>
              <span class="star">⭐</span>
            </div>
          </div>
          <button class="survey-btn">Commencer l'enquête</button>
          <p class="privacy-note">Vos réponses resteront anonymes et confidentielles</p>
        </div>
      </div>
      <style>
        .survey-card {
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }
        .survey-header {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          padding: 35px 25px;
          text-align: center;
        }
        .feedback-icon {
          font-size: 40px;
          margin-bottom: 15px;
          display: block;
        }
        .survey-header h1 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }
        .survey-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .survey-body {
          padding: 30px 25px;
        }
        .intro-text p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 25px;
          font-size: 15px;
        }
        .survey-incentive {
          background: #f0fdf4;
          border: 2px solid #bbf7d0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .reward-badge {
          font-size: 24px;
          margin-right: 15px;
        }
        .reward-text {
          color: #166534;
          font-size: 14px;
        }
        .time-estimate {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          margin-bottom: 25px;
          font-size: 14px;
        }
        .clock-icon {
          margin-right: 8px;
        }
        .rating-preview {
          text-align: center;
          margin-bottom: 25px;
        }
        .rating-preview p {
          color: #374151;
          margin-bottom: 10px;
          font-size: 15px;
        }
        .stars {
          font-size: 20px;
        }
        .star {
          margin: 0 2px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .star:hover {
          transform: scale(1.2);
        }
        .survey-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }
        .survey-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }
        .privacy-note {
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          margin: 0;
          font-style: italic;
        }
      </style>
    `
  }
  ];

  // Fetch email and phone lists from API
  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEmailList(data.emails || []);
        setPhoneList(data.phones || []);
      })
      .catch(() => setError("Erreur lors du chargement des abonnés"))
      .finally(() => setLoading(false));
  }, []);

  // Update preview with CSS support using iframe method
  const updatePreview = (html) => {
    if (!previewRef.current) return;
    
    try {
      previewRef.current.innerHTML = '';
      
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.background = '#fff';
      
      previewRef.current.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Email Preview</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `);
      iframeDoc.close();
      
      setDebugInfo('Preview updated successfully with CSS support');
    } catch (error) {
      setDebugInfo(`Preview Error: ${error.message}`);
    }
  };

  // Auto-update preview when content changes
  useEffect(() => {
    updatePreview(customHtml);
  }, [customHtml]);

  // Email selection functions
  const toggleAllEmails = () => {
    if (selectedEmails.length === emailList.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emailList.map((_, i) => i));
    }
  };

  const toggleEmail = (idx) => {
    setSelectedEmails((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Phone selection functions
  const toggleAllPhones = () => {
    if (selectedPhones.length === phoneList.length) {
      setSelectedPhones([]);
    } else {
      setSelectedPhones(phoneList.map((_, i) => i));
    }
  };

  const togglePhone = (idx) => {
    setSelectedPhones((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Form validation
  const isFormValid = () => {
    return (
      selectedEmails.length > 0 &&
      subject.trim() !== "" &&
      customHtml.trim() !== ""
    );
  };

  // Send email function
  const handleSend = async () => {
    setFormError("");
    if (!isFormValid()) {
      setFormError("Veuillez remplir tous les champs obligatoires et sélectionner au moins un email.");
      return;
    }

    // Get selected emails
    const emails = selectedEmails.map(i => emailList[i]);

    // Extract styles from customHtml
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = customHtml;
    
    // Get all style tags
    const styles = Array.from(tempDiv.getElementsByTagName('style'))
      .map(style => style.textContent)
      .join('\n');
    
    // Remove style tags from content
    tempDiv.querySelectorAll('style').forEach(style => style.remove());
    const contentWithoutStyles = tempDiv.innerHTML;

    // Create the email payload with proper structure
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          /* Reset styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background: #f5f5f5;
            padding: 20px;
          }
          /* User styles */
          ${styles}
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          ${contentWithoutStyles}
        </div>
      </body>
      </html>
    `;

    const payload = {
      emails,
      type: "email",
      subject,
      html: emailContent
    };

    try {
      const res = await fetch(
        "http://localhost/SFE-Project/backend/public/api/send_message",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      
      if (data.success) {
        alert("Message envoyé avec succès!");
        setCustomHtml("");
        setSubject("");
        setSelectedEmails([]);
        setDebugInfo("Email sent successfully");
      } else {
        setFormError(data.error || "Erreur lors de l'envoi");
        setDebugInfo(`Send Error: ${data.error}`);
      }
    } catch (error) {
      setFormError(`Erreur réseau: ${error.message}`);
      setDebugInfo(`Network Error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px'
      }}>
         Les Données Des Abonnées
      </h1>
      
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          Chargement des abonnés...
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: 'red', 
          textAlign: 'center',
          background: '#fee',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Email Selection Section */}
      {emailList.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            <button
              onClick={toggleAllEmails}
              style={{
                marginRight: '15px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid white',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              {selectedEmails.length === emailList.length && emailList.length > 0 ? '✓' : ''}
            </button>
             Abonnés Email ({selectedEmails.length}/{emailList.length} sélectionnés)
          </div>
          
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px'
          }}>
            {emailList.map((email, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                  borderBottom: idx < emailList.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <button
                  onClick={() => toggleEmail(idx)}
                  style={{
                    marginRight: '15px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '3px',
                    border: '2px solid #667eea',
                    background: selectedEmails.includes(idx) ? '#667eea' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  {selectedEmails.includes(idx) ? '✓' : ''}
                </button>
                <span style={{ fontSize: '14px', color: '#333' }}>{email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phone Selection Section */}
      {phoneList.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF5C78 0%, #ff4757 100%)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '10px 10px 0 0',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            
             
             Numéros de Téléphone ({selectedPhones.length}/{phoneList.length} sélectionnés)
          </div>
          
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px'
          }}>
            {phoneList.map((phone, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  background: idx % 2 === 0 ? '#f8f9fa' : '#fff',
                  borderBottom: idx < phoneList.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                <div
                  
                  style={{
                    marginRight: '15px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid #FF5C78',
                    background: selectedPhones.includes(idx) ? '#FF5C78' : 'white',
                    display: 'flex',
                    backgroundColor: '#FF5C78',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  
                </div>
                <span style={{ fontSize: '14px', color: '#333' }}>{phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#333'
        }}>
           Objet de l'email:
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Entrez l'objet de votre email..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
        />
      </div>

      {/* Template Examples */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          🎨 Templates d'exemple:
        </h3>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {templateExamples.map((template, index) => (
            <button
              key={index}
              onClick={() => setCustomHtml(template.content)}
              style={{
                padding: '10px 16px',
                border: '2px solid #667eea',
                borderRadius: '8px',
                background: '#f8f9ff',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f8f9ff';
                e.target.style.color = '#667eea';
              }}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Message Editor and Preview */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        minHeight: '600px'
      }}>
        {/* HTML Editor */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: '#333', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
             Éditeur HTML + CSS:
          </h3>
          <textarea
            value={customHtml}
            onChange={(e) => setCustomHtml(e.target.value)}
            style={{
              width: '96%',
              height: '550px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '14px',
              padding: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.5'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            placeholder="Entrez votre HTML et CSS ici..."
          />
        </div>
        
        {/* Live Preview */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: '#333', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👁️ Aperçu en temps réel:
          </h3>
          <div
            ref={previewRef}
            style={{
              width: '100%',
              height: '550px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              background: '#f8f9fa',
              overflow: 'hidden'
            }}
          />
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '10px 15px', 
        borderRadius: '6px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#666',
        marginBottom: '20px',
        border: '1px solid #e1e8ed'
      }}>
        <strong>Debug:</strong> {debugInfo}
      </div>

      {/* Error Message */}
      {formError && (
        <div style={{ 
          color: '#dc3545', 
          background: '#f8d7da',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ {formError}
        </div>
      )}

      {/* Send Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSend}
          disabled={!isFormValid()}
          style={{
            background: isFormValid() 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#ccc',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            borderRadius: '25px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isFormValid() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            boxShadow: isFormValid() ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
          }}
          onMouseOver={(e) => {
            if (isFormValid()) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseOut={(e) => {
            if (isFormValid()) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          🚀 Envoyer l'Email ({selectedEmails.length} destinataires)
        </button>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '10px',
        color: 'white'
      }}>
        <h4 style={{ margin: '0 0 15px 0' }}>💡 Instructions:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Sélectionnez les destinataires email et/ou les numéros de téléphone</li>
          <li>Entrez un objet pour votre email</li>
          <li>Utilisez les templates d'exemple ou créez votre propre contenu HTML/CSS</li>
          <li>L'aperçu se met à jour automatiquement pendant que vous tapez</li>
          <li>Cliquez sur "Envoyer" pour envoyer votre campagne email</li>
        </ul>
      </div>
    </div>
  );
};

export default IntegratedEmailSystem;