import React, { useState } from 'react';
import { WORKFLOW_STAGES } from '../constants';
import { PixelJar, PixelStarNet, PixelLoomShuttle, PixelMoonBubble } from './PixelProps';
import { PageNavigation } from './PageNavigation';

export const DreamWorkflow: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string>('collect');

  const activeStage =
    WORKFLOW_STAGES.find((s) => s.id === selectedStageId) || WORKFLOW_STAGES[0];

  const activeIndex = WORKFLOW_STAGES.findIndex((s) => s.id === activeStage.id);

  return (
    <section id="workflow" className="workflow-section" aria-label="Dream-Making Workflow">
      <div className="section-header-block">
        <div className="section-eyebrow">
          <span className="pixel-icon">⚙</span>
          <span>Nocturnal Manufacturing Pipeline</span>
        </div>
        <h2 className="section-title">The Three Stages of Sleepcraft</h2>
        <p className="section-subtitle">
          How raw cosmic starlight is gathered, spun into comfort, and delivered into dreaming minds.
        </p>
      </div>

      {/* Connecting Pixel Path between stages */}
      <div className="pixel-pipeline-track" aria-hidden="true">
        <div className="pipeline-line">
          <div
            className="pipeline-fill"
            style={{ width: `${(activeIndex / 2) * 100}%` }}
          />
        </div>
        <div className="pipeline-nodes">
          {WORKFLOW_STAGES.map((s, idx) => (
            <div
              key={s.id}
              className={`pipeline-dot ${idx <= activeIndex ? 'active-dot' : ''}`}
            >
              <span className="dot-num">{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Selector Buttons */}
      <div className="stage-selector-container">
        <div className="stage-nav-strip" role="tablist" aria-label="Workflow Stages">
          {WORKFLOW_STAGES.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                id={`stage-tab-${stage.id}`}
                aria-selected={isSelected}
                aria-controls={`stage-panel-${stage.id}`}
                className={`stage-step-btn ${isSelected ? 'stage-selected' : ''}`}
                onClick={() => setSelectedStageId(stage.id)}
              >
                <div className="step-indicator">
                  <span className="step-num">0{stage.stepNumber}</span>
                  {isSelected && <span className="step-glow-dot"></span>}
                </div>
                <div className="step-text-wrap">
                  <span className="step-title">{stage.title}</span>
                  <span className="step-subtitle">{stage.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Display Board */}
      <div
        id={`stage-panel-${activeStage.id}`}
        role="tabpanel"
        aria-labelledby={`stage-tab-${activeStage.id}`}
        className="stage-display-board"
      >
        <div className="stage-display-grid">
          {/* Left: Dynamic Illustrated Object / SVG Scene with Pixel Art Props */}
          <div className="stage-visual-container">
            <div className="stage-scene-frame">
              {activeStage.id === 'collect' && (
                <div className="stage-scene-canvas collect-scene" aria-label="Illustration of collecting starlight in crystal jars">
                  <div className="pixel-art-prop-stage">
                    <PixelStarNet size={80} />
                    <PixelJar size={90} />
                  </div>
                  <svg viewBox="0 0 400 220" className="workflow-svg">
                    <circle cx="200" cy="110" r="90" fill="var(--starlight-amber)" opacity="0.1" />
                    {/* Floating sparks */}
                    <circle cx="160" cy="90" r="6" fill="var(--starlight-amber)" className="floating-ember e1" />
                    <circle cx="240" cy="70" r="8" fill="#fff" className="floating-ember e2" />
                    <circle cx="210" cy="140" r="7" fill="var(--soft-rose)" className="floating-ember e3" />
                    <text x="80" y="60" fill="var(--starlight-amber)" fontSize="18" className="sparkle-anim s1">✦</text>
                    <text x="310" y="80" fill="var(--starlight-amber)" fontSize="20" className="sparkle-anim s2">★</text>
                  </svg>
                  <div className="scene-status-tag">✦ Velvet Net & Crystal Jars Active</div>
                </div>
              )}

              {activeStage.id === 'craft' && (
                <div className="stage-scene-canvas craft-scene" aria-label="Illustration of weaving starlight on the dream loom">
                  <div className="pixel-art-prop-stage">
                    <PixelLoomShuttle size={100} />
                  </div>
                  <svg viewBox="0 0 400 220" className="workflow-svg">
                    {/* Astral Loom Frame */}
                    <rect x="70" y="40" width="260" height="130" rx="8" fill="none" stroke="var(--cocoa)" strokeWidth="4" />
                    {/* Warp & Weft Threads */}
                    <line x1="110" y1="40" x2="110" y2="170" stroke="var(--starlight-amber)" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                    <line x1="150" y1="40" x2="150" y2="170" stroke="var(--soft-rose)" strokeWidth="2.5" opacity="0.9" />
                    <line x1="200" y1="40" x2="200" y2="170" stroke="var(--starlight-amber)" strokeWidth="3" />
                    <line x1="250" y1="40" x2="250" y2="170" stroke="var(--soft-rose)" strokeWidth="2.5" opacity="0.9" />
                    <line x1="290" y1="40" x2="290" y2="170" stroke="var(--starlight-amber)" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                    {/* Woven Dream Fabric in Center */}
                    <rect x="130" y="85" width="140" height="50" rx="8" fill="var(--rich-berry)" opacity="0.35" stroke="var(--starlight-amber)" strokeWidth="2" />
                    <circle cx="200" cy="110" r="14" fill="var(--starlight-amber)" className="floating-ember e1" />
                  </svg>
                  <div className="scene-status-tag">✦ Spinning Memory Tapestry</div>
                </div>
              )}

              {activeStage.id === 'deliver' && (
                <div className="stage-scene-canvas deliver-scene" aria-label="Illustration of delivering dream bubbles via constellation winds">
                  <div className="pixel-art-prop-stage">
                    <PixelMoonBubble size={84} />
                  </div>
                  <svg viewBox="0 0 400 220" className="workflow-svg">
                    {/* Wind currents */}
                    <path
                      d="M30,120 Q130,40 230,110 T370,60"
                      fill="none"
                      stroke="var(--starlight-amber)"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      className="wind-stream"
                    />
                    <path
                      d="M20,160 Q140,80 260,150 T380,90"
                      fill="none"
                      stroke="var(--soft-rose)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                    {/* Chimney destination */}
                    <rect x="320" y="140" width="50" height="60" fill="var(--cocoa)" rx="3" />
                    <rect x="315" y="132" width="60" height="12" fill="var(--rich-berry)" rx="2" />
                  </svg>
                  <div className="scene-status-tag">✦ Airborne Moon-Bubble Slumber Drop</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Explanatory Content, Tools, and Pip's Notes */}
          <div className="stage-info-container">
            <div className="stage-badge-heading">
              <span className="stage-step-tag">Step {activeStage.stepNumber} of 3</span>
              <h3 className="stage-active-title">{activeStage.title}</h3>
            </div>

            <p className="stage-summary">{activeStage.summary}</p>

            {/* Tools Utilized */}
            <div className="stage-tools-box">
              <h4 className="tools-title">Required Equipment & Ingredients:</h4>
              <ul className="tools-pill-list">
                {activeStage.tools.map((t, idx) => (
                  <li key={idx} className="tool-pill">
                    <span className="pill-dot">✦</span> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Potency Meter */}
            <div className="potency-meter-card">
              <div className="meter-header">
                <span className="meter-label">{activeStage.potencyMetric.label}</span>
                <span className="meter-value">{activeStage.potencyMetric.value}</span>
              </div>
              <div className="meter-track" role="progressbar" aria-valuenow={activeStage.potencyMetric.percentage} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="meter-fill"
                  style={{ width: `${activeStage.potencyMetric.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Pip's Field Note Callout */}
            <div className="pip-field-note">
              <div className="note-avatar-tag">
                <span className="note-pin">📌</span>
                <strong>Pip's Engineer Log:</strong>
              </div>
              <p className="note-text">&ldquo;{activeStage.pipNote}&rdquo;</p>
              <div className="craft-tip">
                <span className="tip-bold">Artisan Tip:</span> {activeStage.craftingTip}
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
