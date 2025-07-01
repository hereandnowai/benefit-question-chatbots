import React from 'react';
import { BRAND_INFO } from '../constants'; // Uncommented and will be used directly

interface HomePageProps {
  onStartChat: () => void;
}

const functionalities = [
  { title: "Benefits Plan Info", description: "Detailed explanations of health, dental, vision, retirement plans, and more.", icon: "📖", ariaLabel: "Book icon" },
  { title: "Enrollment Assistance", description: "Step-by-step guidance through enrollment processes, deadlines, and documentation.", icon: "📝", ariaLabel: "Pencil and paper icon" },
  { title: "Claims Support", description: "Help with submitting claims, tracking status, and understanding appeals.", icon: "🛠️", ariaLabel: "Tools icon" },
  { title: "Eligibility Verification", description: "Determine your eligibility for various benefits based on your status.", icon: "✅", ariaLabel: "Checkmark icon" },
  { title: "Cost Calculations", description: "Understand premium costs, deductibles, co-pays, and out-of-pocket maximums.", icon: "💲", ariaLabel: "Dollar sign icon" },
  { title: "Dependent Management", description: "Assistance with adding or removing dependents and qualifying life events.", icon: "👨‍👩‍👧‍👦", ariaLabel: "Family icon" },
  { title: "Contact Information", description: "Find relevant HR contacts, benefits administrators, and insurance carriers.", icon: "📞", ariaLabel: "Telephone icon" },
];

export const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  // Access BRAND_INFO directly from the import

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8" style={{ color: 'var(--app-text)', minHeight: 'calc(100vh - 128px)' }}> {/* Adjust minHeight based on header/footer */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--app-accent)' }}>
          Welcome to {BRAND_INFO.brand.appName}!
        </h2>
        <p className="text-lg md:text-xl mb-1">
          Your dedicated AI assistant for {BRAND_INFO.brand.organizationShortName} employee benefits.
        </p>
        <p className="text-md md:text-lg opacity-90">
          I'm here to make understanding and managing your benefits simple and accessible.
        </p>
        <p className="mt-4 text-md font-semibold" style={{ color: 'var(--app-accent)' }}>Here's how I can help you:</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-2">
        {functionalities.map((func) => (
          <div 
            key={func.title}
            className="rounded-xl shadow-2xl p-5 sm:p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              color: 'var(--card-text)',
              borderColor: 'var(--card-border)', 
              borderWidth: '2px', 
              borderStyle: 'solid',
            }}
          >
            <span className="text-4xl mb-3" role="img" aria-label={func.ariaLabel}>{func.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{func.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--app-text-muted)'}}>{func.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStartChat}
        className={`mt-8 md:mt-12 py-3 px-10 text-lg font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={{
          backgroundColor: 'var(--button-primary-bg)',
          color: 'var(--button-primary-text)',
          // @ts-ignore
          '--tw-ring-color': 'var(--app-accent)',
          // @ts-ignore
          '--tw-ring-offset-color': 'var(--app-bg)'
        }}
        aria-label="Start chat with Benefits Bot"
      >
        Ask BenefitsBot
      </button>
    </div>
  );
};
// Removed the problematic block that used 'require'
