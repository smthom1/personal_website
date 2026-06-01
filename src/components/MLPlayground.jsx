import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================================================
// INTERACTIVE REACT MACHINE LEARNING PLAYGROUND SANDBOX
// ==========================================================================
// Welcome! I built this visualizer because machine learning can often feel 
// like a mathematical black box. Here, we train a simple Linear Support Vector 
// Machine (SVM) classifier to separate 'Class A' (Split pistachio seeds) from 
// 'Class B' (Non-split seeds) using live Stochastic Gradient Descent (SGD).
// ==========================================================================

const MLPlayground = () => {
    // Hyperparameters that users can adjust in real-time
    const [learningRate, setLearningRate] = useState(0.1);
    const [noise, setNoise] = useState(15);
    const [isTraining, setIsTraining] = useState(false);
    const [epoch, setEpoch] = useState(0);
    const [loss, setLoss] = useState(0.85);
    const [accuracy, setAccuracy] = useState(50);

    // Model parameters representing the separating hyperplane: w_x * x + w_y * y + bias = 0
    const [weights, setWeights] = useState({ wx: 0.1, wy: -0.2, bias: 0.05 });

    // History log to draw the sleek, glowing convergence sparkline
    const [lossHistory, setLossHistory] = useState([0.85]);

    // Track active coordinates for the glassmorphic plot tooltip
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const trainingInterval = useRef(null);

    // Target separator (ground truth / original ideal boundary)
    const targetSlope = 0.8;
    const targetIntercept = 0;

    // Generate 40 synthetic classification data points based on selected noise
    const dataset = useMemo(() => {
        const points = [];
        const rng = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 1; i <= 40; i++) {
            // Mapping points on the coordinate plane range: [-1, 1]
            const x = (rng(i * 12.3) * 2 - 1) * 0.85;
            const y = (rng(i * 37.7) * 2 - 1) * 0.85;

            // Ideal boundary line: y = targetSlope * x + targetIntercept
            const distance = y - (targetSlope * x + targetIntercept);

            // Injecting Gaussian-like noise shift
            const noiseShift = (rng(i * 99.4) * 2 - 1) * (noise / 100);
            const label = distance + noiseShift > 0 ? 1 : -1; // Class A (Split) or B (Non-Split)

            points.push({ x, y, label });
        }
        return points;
    }, [noise]);

    // Calculate dynamic accuracy and hinge loss metrics based on current model weights
    const getMetricsForWeights = (w) => {
        let correct = 0;
        let totalLoss = 0;

        dataset.forEach(p => {
            const predictionVal = w.wx * p.x + w.wy * p.y + w.bias;
            const predictedLabel = predictionVal > 0 ? 1 : -1;

            if (predictedLabel === p.label) correct++;

            // Standard Hinge Loss: L = max(0, 1 - y * f(x))
            // Encourages not just correct classification, but a clean, wide margin!
            const margin = p.label * predictionVal;
            totalLoss += Math.max(0, 1 - margin);
        });

        const currentAcc = Math.round((correct / dataset.length) * 100);
        const avgLoss = parseFloat((totalLoss / dataset.length).toFixed(3));

        return { accuracy: currentAcc, loss: avgLoss };
    };

    const metrics = useMemo(() => {
        return getMetricsForWeights(weights);
    }, [dataset, weights]);

    // Synchronize stats when training stops
    useEffect(() => {
        if (!isTraining) {
            setAccuracy(metrics.accuracy);
            setLoss(metrics.loss);
            setLossHistory([metrics.loss]);
        }
    }, [metrics, isTraining]);

    // Perform a single step of Stochastic Gradient Descent (SGD)
    const performTrainingStep = () => {
        setWeights(prev => {
            let nextWx = prev.wx;
            let nextWy = prev.wy;
            let nextBias = prev.bias;

            // 1. Pick a single random data sample (the 'Stochastic' part of SGD)
            const randomSample = dataset[Math.floor(Math.random() * dataset.length)];
            const prediction = prev.wx * randomSample.x + prev.wy * randomSample.y + prev.bias;

            // 2. Hinge Loss Gradient Update (if it violates the margin boundary)
            if (randomSample.label * prediction < 1) {
                nextWx += learningRate * (randomSample.label * randomSample.x - 0.05 * prev.wx);
                nextWy += learningRate * (randomSample.label * randomSample.y - 0.05 * prev.wy);
                nextBias += learningRate * randomSample.label;
            } else {
                // 3. Regularization Decay (L2 penalty) - shrinks weights to encourage a wider margin
                nextWx -= learningRate * 0.05 * prev.wx;
                nextWy -= learningRate * 0.05 * prev.wy;
            }

            const nextW = { wx: nextWx, wy: nextWy, bias: nextBias };

            // Record dynamic convergence sparkline history
            const nextMetrics = getMetricsForWeights(nextW);
            setLossHistory(history => {
                const nextHistory = [...history, nextMetrics.loss];
                if (nextHistory.length > 50) nextHistory.shift();
                return nextHistory;
            });

            return nextW;
        });

        setEpoch(e => e + 1);
    };

    // Toggle the interval timer for smooth training frames
    const handleTrainToggle = () => {
        if (isTraining) {
            clearInterval(trainingInterval.current);
            setIsTraining(false);
        } else {
            setIsTraining(true);
            trainingInterval.current = setInterval(() => {
                performTrainingStep();
            }, 45); // Run epoch iterations every 45ms (feels responsive and fast!)
        }
    };

    // Clean up timers on unmount
    useEffect(() => {
        return () => clearInterval(trainingInterval.current);
    }, []);

    // Halt training automatically when model successfully converges or max epochs hit
    useEffect(() => {
        if (isTraining && (epoch >= 150 || metrics.accuracy >= 98)) {
            clearInterval(trainingInterval.current);
            setIsTraining(false);
            setAccuracy(metrics.accuracy);
            setLoss(metrics.loss);
        }
    }, [epoch, isTraining, metrics]);

    // Reset model parameters to their initial states
    const handleReset = () => {
        clearInterval(trainingInterval.current);
        setIsTraining(false);
        setEpoch(0);
        setWeights({ wx: -0.4, wy: 0.3, bias: -0.1 });
        setAccuracy(50);
        setLoss(0.92);
        setLossHistory([0.92]);
        setHoveredPoint(null);
    };

    // Calculate separating line endpoints: y = (-w_x * x - bias) / w_y
    const decisionLinePath = useMemo(() => {
        const { wx, wy, bias } = weights;
        if (Math.abs(wy) < 0.001) return null; // Prevent division-by-zero crashes

        const yStart = (-wx * -1.2 - bias) / wy;
        const yEnd = (-wx * 1.2 - bias) / wy;

        // Map coordinate plane range [-1.2, 1.2] to SVG viewport coordinates [0, 200]
        const mapRange = (val) => ((val + 1.2) / 2.4) * 200;

        return {
            x1: mapRange(-1.2),
            y1: mapRange(yStart),
            x2: mapRange(1.2),
            y2: mapRange(yEnd)
        };
    }, [weights]);

    // Draw the sparkline chart coordinates
    const generateSparklineLinePath = (history) => {
        if (history.length < 2) return "";
        const maxVal = Math.max(1.0, ...history);
        const minVal = 0;
        const range = maxVal - minVal;
        const mapY = (val) => 38 - ((val - minVal) / range) * 36;

        return history.map((val, idx) => {
            const x = (idx / (history.length - 1)) * 160;
            const y = mapY(val);
            return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }).join(" ");
    };

    const generateSparklineAreaPath = (history) => {
        const lineD = generateSparklineLinePath(history);
        if (!lineD) return "";
        return `${lineD} L 160 40 L 0 40 Z`;
    };

    const handlePointHover = (p, cx, cy) => {
        const predictionVal = weights.wx * p.x + weights.wy * p.y + weights.bias;
        const predictedLabel = predictionVal > 0 ? 1 : -1;
        const isCorrect = predictedLabel === p.label;
        const margin = p.label * predictionVal;

        setHoveredPoint({
            x: p.x,
            y: p.y,
            label: p.label,
            margin: margin,
            isCorrect: isCorrect,
            xOffset: cx,
            yOffset: cy
        });
    };

    return (
        <div className="sandbox-card glass-card">
            <div className="sandbox-grid">

                {/* Hyperparameter Adjustments Board */}
                <div className="sandbox-controls">
                    <h3>Model Parameters</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                        Adjust hyperparameters to observe classification boundary movements.
                    </p>

                    <div className="hyper-group">
                        <div className="hyper-header">
                            <span>Learning Rate (&eta;)</span>
                            <span className="hyper-value">{learningRate.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.02"
                            max="0.4"
                            step="0.02"
                            className="hyper-slider"
                            value={learningRate}
                            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                            disabled={isTraining}
                        />
                    </div>

                    <div className="hyper-group">
                        <div className="hyper-header">
                            <span>Data Noise Level</span>
                            <span className="hyper-value">{noise}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            step="5"
                            className="hyper-slider"
                            value={noise}
                            onChange={(e) => setNoise(parseInt(e.target.value))}
                            disabled={isTraining}
                        />
                    </div>

                    {/* Stats Dashboard */}
                    <div className="sandbox-metrics">
                        <div className="metric-chip">
                            <span className="chip-label">EPOCHS</span>
                            <span className="chip-value">{epoch} / 150</span>
                        </div>
                        <div className="metric-chip">
                            <span className="chip-label">LOSS</span>
                            <span className="chip-value" style={{ color: "var(--color-primary)" }}>{loss}</span>
                        </div>
                        <div className="metric-chip">
                            <span className="chip-label">ACCURACY</span>
                            <span className="chip-value" style={{ color: "var(--color-accent)" }}>{accuracy}%</span>
                        </div>
                    </div>

                    <div className="accuracy-bar-bg">
                        <div
                            className="accuracy-bar-fill"
                            style={{
                                width: `${accuracy}%`,
                                background: accuracy > 85 ? "var(--color-success)" : "var(--color-gradient)"
                            }}
                        ></div>
                    </div>

                    {/* Dynamic Loss Sparkline */}
                    {lossHistory.length > 1 && (
                        <div className="sparkline-wrapper">
                            <div className="sparkline-header">
                                <span>Real-Time Loss Sparkline</span>
                                <span>Convergence Curve</span>
                            </div>
                            <svg className="sparkline-svg" viewBox="0 0 160 40">
                                <defs>
                                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(147, 51, 234, 0.25)" />
                                        <stop offset="100%" stopColor="rgba(147, 51, 234, 0.0)" />
                                    </linearGradient>
                                </defs>
                                <path d={generateSparklineAreaPath(lossHistory)} fill="url(#sparklineGrad)" />
                                <path d={generateSparklineLinePath(lossHistory)} fill="none" stroke="var(--color-primary)" strokeWidth="1.8" />
                            </svg>
                        </div>
                    )}

                    <div className="sandbox-actions">
                        <button
                            className={`btn ${isTraining ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ flexGrow: 1, padding: "10px 16px" }}
                            onClick={handleTrainToggle}
                        >
                            {isTraining ? 'Stop Training' : 'Train Classifier'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: "10px 16px" }}
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>

                    {accuracy >= 92 && (
                        <div className="success-banner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
                            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--color-success)" }}>Model Convergence Achieved!</span>
                        </div>
                    )}
                </div>

                {/* SVGs Classification Plot Plane */}
                <div className="sandbox-visual">
                    <div className={`sandbox-plot-container ${isTraining ? 'training-active' : ''}`}>
                        <svg className="sandbox-plot" viewBox="0 0 200 200">
                            {/* Core Plot Grid lines */}
                            <line x1="0" y1="100" x2="200" y2="100" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />
                            <line x1="100" y1="0" x2="100" y2="200" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="3" />

                            {/* Decision Boundary Line */}
                            {decisionLinePath && (
                                <line
                                    x1={decisionLinePath.x1}
                                    y1={decisionLinePath.y1}
                                    x2={decisionLinePath.x2}
                                    y2={decisionLinePath.y2}
                                    stroke="var(--color-accent)"
                                    strokeWidth="2.5"
                                    style={{
                                        filter: "drop-shadow(0 0 4px var(--color-accent))",
                                        transition: isTraining ? "none" : "all 0.15s ease"
                                    }}
                                />
                            )}

                            {/* Scattered Data Points */}
                            {dataset.map((p, idx) => {
                                // Map coordinates [-1.2, 1.2] to plot plane [0, 200]
                                const mapCoord = (val) => ((val + 1.2) / 2.4) * 200;
                                const cx = mapCoord(p.x);
                                const cy = mapCoord(p.y);

                                // Check predicted class using current weights
                                const predicted = weights.wx * p.x + weights.wy * p.y + weights.bias > 0 ? 1 : -1;
                                const isCorrect = predicted === p.label;

                                return (
                                    <circle
                                        key={idx}
                                        cx={cx}
                                        cy={cy}
                                        r={3.5}
                                        fill={p.label > 0 ? "var(--color-primary)" : "var(--color-accent)"}
                                        stroke={isCorrect ? "none" : "#ef4444"}
                                        strokeWidth={isCorrect ? 0 : 1.2}
                                        strokeDasharray={isCorrect ? "" : "2"}
                                        style={{
                                            opacity: isCorrect ? 0.85 : 0.45,
                                            cursor: "pointer",
                                            filter: isCorrect ? "none" : "drop-shadow(0 0 3px rgba(239, 68, 68, 0.6))",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={() => handlePointHover(p, cx, cy)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                );
                            })}
                        </svg>

                        {/* Interactive Dynamic Glassmorphic Tooltip */}
                        {hoveredPoint && (
                            <div
                                className="sandbox-tooltip glass-card"
                                style={{
                                    left: `${(hoveredPoint.xOffset / 200) * 100}%`,
                                    top: `${(hoveredPoint.yOffset / 200) * 100}%`
                                }}
                            >
                                <div className="tooltip-title" style={{ color: hoveredPoint.label > 0 ? "var(--color-primary)" : "var(--color-accent)" }}>
                                    {hoveredPoint.label > 0 ? "Class A (Split)" : "Class B (Non-Split)"}
                                </div>
                                <div className="tooltip-row">Coord: <strong>({hoveredPoint.x.toFixed(2)}, {hoveredPoint.y.toFixed(2)})</strong></div>
                                <div className="tooltip-row">Margin: <span style={{ fontWeight: "600", color: hoveredPoint.margin >= 1 ? "var(--color-success)" : hoveredPoint.margin >= 0 ? "var(--text-secondary)" : "#ef4444" }}>
                                    {hoveredPoint.margin.toFixed(2)}
                                </span></div>
                                <div className="tooltip-status" style={{ color: hoveredPoint.isCorrect ? "var(--color-success)" : "#ef4444" }}>
                                    Status: <strong>{hoveredPoint.isCorrect ? "Correct" : "Misclassified"}</strong>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="sandbox-legend">
                        <div className="legend-item">
                            <span className="legend-dot" style={{ backgroundColor: "var(--color-primary)" }}></span>
                            <span>Class A (Split)</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ backgroundColor: "var(--color-accent)" }}></span>
                            <span>Class B (Non-Split)</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Dynamic Educational Snippet explaining SVM/SGD */}
            <div className="sandbox-explanation">
                <h4 className="explanation-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                    Behind the Scenes: How It Works
                </h4>
                <div className="explanation-grid">
                    <div>
                        <p style={{ marginBottom: "12px" }}>
                            <strong>The Classifier (Linear SVM):</strong> The visual boundary line represents the equation:
                        </p>
                        <div className="math-card">
                            w<sub>x</sub> &middot; x + w<sub>y</sub> &middot; y + bias = 0
                        </div>
                        <p style={{ fontSize: "0.82rem" }}>
                            Points with <code>val &gt; 0</code> are classified as <strong>Class A (Split)</strong> and points with <code>val &lt; 0</code> as <strong>Class B (Non-Split)</strong>. Hovering over a point shows its exact margin distance from this separating plane.
                        </p>
                    </div>
                    <div>
                        <p style={{ marginBottom: "12px" }}>
                            <strong>The Training Loop (SGD):</strong> Clicking <em>Train Classifier</em> triggers real-time Stochastic Gradient Descent using a hinge-loss loss function. For every step:
                        </p>
                        <ul className="explanation-list" style={{ fontSize: "0.82rem" }}>
                            <li>The model draws a random sample and computes the error (loss) against its classification margin.</li>
                            <li>If misclassified (violating the margin), we shift the weights <code>w</code> and <code>bias</code> in the negative direction of the gradient.</li>
                            <li>L2 Regularization decay (0.05 factor) runs continuously to prevent overfitting and encourage a wider separating margin.</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MLPlayground;
