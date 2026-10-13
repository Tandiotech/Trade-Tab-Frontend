export const jobQuestions=[
  {
    "section": "Personal Information",
    "questions": [
      {
        "key": "first_name",
        "label": "First Name",
        "type": "text",
        "placeholder": "Enter your first name"
      },
      {
        "key": "last_name",
        "label": "Last Name",
        "type": "text",
        "placeholder": "Enter your last name"
      },
      {
        "key": "email",
        "label": "Email Address",
        "type": "email",
        "placeholder": "Enter your email"
      },
      {
        "key": "phone_number",
        "label": "Phone Number",
        "type": "tel",
        "placeholder": "Enter your phone number"
      },
      {
        "key": "location",
        "label": "Current Location (City & Country)",
        "type": "text",
        "placeholder": "Enter your current location"
      },
      {
        "key": "tradetab_link",
        "label": "Do you have a TradeTab Shareable Link?",
        "type": "text",
        "placeholder": "Enter the link if applicable"
      }
    ]
  },
  {
    "section": "Position Interest",
    "questions": [
      {
        "key": "position",
        "label": "Which position are you applying for?",
        "type": "select",
        "options": [
          "Technical Trader",
          "Fundamental Trader",
          "Risk Management Specialist",
          "Other"
        ]
      }
    ]
  },
  {
    "section": "Trading Experience",
    "questions": [
      {
        "key": "experience_years",
        "label": "How many years of trading or financial markets experience do you have?",
        "type": "select",
        "options": [
          "Less than 1 year",
          "1-3 years",
          "4-6 years",
          "7+ years"
        ]
      }
    ]
  },
  {
    "section": "Expertise & Skills",
    "questions": [
      {
        "key": "expertise",
        "label": "Which areas of trading or finance do you specialize in?",
        "type": "checkbox",
        "options": [
          "Technical Analysis",
          "Fundamental Analysis",
          "Risk Management",
          "Algorithmic Trading",
          "Other"
        ]
      }
    ]
  },
  {
    "section": "Certifications & Education",
    "questions": [
      {
        "key": "certifications",
        "label": "Do you hold any relevant certifications or completed any trading-related courses?",
        "type": "radio",
        "options": [
          "Yes",
          "No"
        ]
      },
      // {
      //   "key": "certification_details",
      //   "label": "If yes, please specify",
      //   "type": "text",
      //   "placeholder": "Enter certification details",
      //   "conditional": "certifications === 'Yes'"
      // },
      {
        "key": "education_level",
        "label": "What is your highest level of education?",
        "type": "select",
        "options": [
          "High School Diploma",
          "Bachelor's Degree",
          "Master's Degree",
          "Other"
        ]
      }
    ]
  },
  {
    "section": "Tools & Platforms",
    "questions": [
      {
        "key": "tools",
        "label": "Which trading platforms and tools are you proficient with?",
        "type": "checkbox",
        "options": [
          "MetaTrader 4",
          "MetaTrader 5",
          "TradingView",
          "cTrader"
        ]
      }
    ]
  },
  {
    "section": "Markets Traded",
    "questions": [
      {
        "key": "markets",
        "label": "Which financial markets have you traded in?",
        "type": "checkbox",
        "options": [
          "Forex",
          "Stocks",
          "Commodities",
          "Indices",
          "Cryptocurrencies",
          "Other"
        ]
      },
      {
        "key": "favorite_symbols",
        "label": "What are your favourite symbols to trade?",
        "type": "text",
        "placeholder": "Enter your favorite symbols"
      }
    ]
  },
  {
    "section": "Achievements & Motivation",
    "questions": [
      {
        "key": "achievements",
        "label": "Describe a significant achievement or decision you’ve made in trading or risk management:",
        "type": "textarea",
        "placeholder": "Describe your achievement"
      },
      {
        "key": "motivation",
        "label": "What motivates you to work in the trading industry, and why do you want to join TradeTab?",
        "type": "textarea",
        "placeholder": "Enter your motivation"
      }
    ]
  },
  {
    "section": "Community",
    "questions": [
      {
        "key": "has_network",
        "label": "Do you have a network or community of traders?",
        "type": "radio",
        "options": [
          "Yes",
          "No"
        ]
      },
      // {
      //   "key": "network_size",
      //   "label": "If yes, how many traders are within your network?",
      //   "type": "text",
      //   "placeholder": "Enter the size of your network",
      //   "conditional": "has_network === 'Yes'"
      // }
    ]
  },
  {
    "section": "Availability",
    "questions": [
      {
        "key": "flexible_hours",
        "label": "Are you available to work flexible hours or shifts to accommodate global markets?",
        "type": "radio",
        "options": [
          "Yes",
          "No"
        ]
      },
      // {
      //   "key": "start_date",
      //   "label": "What is your expected start date?",
      //   "type": "date"
      // }
    ]
  }
]
