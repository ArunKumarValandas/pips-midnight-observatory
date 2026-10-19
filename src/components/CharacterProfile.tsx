import React, { useState } from 'react';
import { PIP_DOSSIER } from '../constants';
import { PageNavigation } from './PageNavigation';

export const CharacterProfile: React.FC = () => {
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'profile' | 'tools' | 'quirks'>('profile');

  const currentQuote = PIP_DOSSIER.voiceQuotes[activeVoiceIndex];

  return (
    <section id="character" className="character-section" aria-label="Character Dossier: Pip the Skull Baby">
      <div className="section-header-block">
        <div className="section-eyebrow">
          <span className="pixel-icon">✦</span>
          <span>Personnel Dossier — Midnight Nursery</span>
        </div>
        <h2 className="section-title">Meet Pip, the Skull Baby</h2>
        <p className="section-subtitle">
          Junior Dream Engineer, caretaker of sleepy stars, and weaver of nocturnal comfort.
        </p>
      </div>

      <div className="dossier-wrapper">
        <div className="dossier-grid">
          {/* Left: Framed Character Portrait & Identification Card */}
          <div className="dossier-portrait-panel">
            <div className="portrait-frame">
              <div className="frame-corner top-left"></div>
              <div className="frame-corner top-right"></div>
              <div className="frame-corner bottom-left"></div>
              <div className="frame-corner bottom-right"></div>

              <img
                src="/images/pip_portrait.png"
                alt="Formal portrait of Pip holding the warm moon lantern and music box, sitting cozy on a cloud"
                className="pip-portrait-img"
                loading="lazy"
                width="360"
                height="540"
              />

              <div className="portrait-caption">
                <span className="stamp-badge">VERIFIED ARTISAN</span>
                <span className="portrait-name">Pip (Class III)</span>
              </div>
            </div>

            {/* Quick Stats Pill Grid */}
            <div className="quick-spec-grid">
              <div className="spec-card">
                <span className="spec-label">Role</span>
                <span className="spec-value">Dream Engineer</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Shift</span>
                <span className="spec-value">8:00 PM – Dawn</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Rank</span>
                <span className="spec-value">Junior Artisan</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Heart</span>
                <span className="spec-value">100% Gentle</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Dossier Tabs & Information */}
          <div className="dossier-details-panel">
            {/* Dossier Tabs */}
            <div className="dossier-tab-bar" role="tablist" aria-label="Dossier Categories">
              <button
                type="button"
                role="tab"
                id="tab-profile"
                aria-selected={activeTab === 'profile'}
                aria-controls="panel-profile"
                className={`dossier-tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span>📜 Bio & Appearance</span>
              </button>
              <button
                type="button"
                role="tab"
                id="tab-quirks"
                aria-selected={activeTab === 'quirks'}
                aria-controls="panel-quirks"
                className={`dossier-tab ${activeTab === 'quirks' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('quirks')}
              >
                <span>✨ Quirks & Habits</span>
              </button>
              <button
                type="button"
                role="tab"
                id="tab-tools"
                aria-selected={activeTab === 'tools'}
                aria-controls="panel-tools"
                className={`dossier-tab ${activeTab === 'tools' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('tools')}
              >
                <span>🛠️ Dream Tools</span>
              </button>
            </div>

            {/* Tab 1: Bio & Appearance */}
            {activeTab === 'profile' && (
              <div
                id="panel-profile"
                role="tabpanel"
                aria-labelledby="tab-profile"
                className="tab-content"
              >
                <div className="dossier-field">
                  <h3 className="field-title">Species & Nature</h3>
                  <p className="field-body">{PIP_DOSSIER.species}</p>
                </div>

                <div className="dossier-field">
                  <h3 className="field-title">Visual Appearance</h3>
                  <p className="field-body">{PIP_DOSSIER.appearance}</p>
                </div>

                <div className="dossier-field">
                  <h3 className="field-title">Personality & Disposition</h3>
                  <p className="field-body">{PIP_DOSSIER.personality}</p>
                </div>

                <div className="dossier-field">
                  <h3 className="field-title">Profession & Duty</h3>
                  <p className="field-body">
                    {PIP_DOSSIER.profession} at {PIP_DOSSIER.organization}. Pip oversees nocturnal
                    calm, making sure restless minds receive soft, sweet dreams instead of nightmares.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Quirks & Habits */}
            {activeTab === 'quirks' && (
              <div
                id="panel-quirks"
                role="tabpanel"
                aria-labelledby="tab-quirks"
                className="tab-content"
              >
                <h3 className="field-title">Endearing Quirks & Sleepy Customs</h3>
                <ul className="quirks-list">
                  {PIP_DOSSIER.quirks.map((quirk, idx) => (
                    <li key={idx} className="quirk-item">
                      <span className="quirk-bullet">★</span>
                      <span>{quirk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 3: Tools */}
            {activeTab === 'tools' && (
              <div
                id="panel-tools"
                role="tabpanel"
                aria-labelledby="tab-tools"
                className="tab-content"
              >
                <h3 className="field-title">Artisan Field Equipment</h3>
                <div className="tools-grid">
                  {PIP_DOSSIER.toolsOfTrade.map((tool, idx) => (
                    <div key={idx} className="tool-card">
                      <h4 className="tool-name">
                        <span className="tool-icon">✦</span> {tool.name}
                      </h4>
                      <p className="tool-desc">{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pip's Spoken Voice Section with Switchable Quotes */}
            <div className="pip-voice-box">
              <div className="voice-header">
                <span className="voice-title">Pip's Spoken Voice & Bedtime Notes:</span>
                <div className="voice-pips" role="group" aria-label="Quote Selector">
                  {PIP_DOSSIER.voiceQuotes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`voice-pip-btn ${i === activeVoiceIndex ? 'active' : ''}`}
                      onClick={() => setActiveVoiceIndex(i)}
                      aria-label={`View quote ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <blockquote className="voice-quote">
                &ldquo;{currentQuote.quote}&rdquo;
              </blockquote>
              <div className="voice-context">
                <span className="context-label">Context:</span> {currentQuote.context}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Five-Page Observatory Navigation Section */}
      <PageNavigation />
    </section>
  );
};
