// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

class AISmartComparisonSystem {
    constructor() {
        this.productType = '';
        this.useCase = '';
        this.specFramework = [];
        this.documents = [];
        this.comparisonData = [];
        this.aiResearcher = new AIResearchEngine();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromStorage();
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('documentFiles');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.background = '#e3f2fd';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = '';
            fileInput.files = e.dataTransfer.files;
            this.updateDocumentList();
        });

        fileInput.addEventListener('change', () => {
            this.updateDocumentList();
        });
    }

    updateDocumentList() {
        const docList = document.getElementById('documentList');
        const files = document.getElementById('documentFiles').files;
        
        docList.innerHTML = '';
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span>${file.name}</span>
                    <small>${this.formatFileSize(file.size)}</small>
                `;
                docList.appendChild(fileItem);
            });
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async researchSpecifications() {
        this.productType = document.getElementById('productType').value.trim();
        this.useCase = document.getElementById('productUseCase').value.trim();
        
        if (!this.productType) {
            alert('Please enter what product you want to compare');
            return;
        }

        this.showResearchProgress(true);
        this.updateResearchStep('Starting AI research...', 'working');

        try {
            // Get AI-generated specification framework
            this.specFramework = await this.aiResearcher.researchProductSpecifications(
                this.productType, 
                this.useCase
            );
            
            this.updateResearchStep('Specification framework generated successfully', 'complete');
            this.displaySpecificationFramework();
            this.showResearchProgress(false);
            
        } catch (error) {
            this.updateResearchStep('Research failed: ' + error.message, 'error');
            console.error('Research failed:', error);
        }
    }

    updateResearchStep(message, status = 'working') {
        const stepsDiv = document.getElementById('researchSteps');
        const stepItem = document.createElement('div');
        stepItem.className = `step-item ${status}`;
        stepItem.textContent = message;
        stepsDiv.appendChild(stepItem);
        stepsDiv.scrollTop = stepsDiv.scrollHeight;
    }

    displaySpecificationFramework() {
        const specsDiv = document.getElementById('aiSpecifications');
        let html = '<div class="spec-categories">';
        
        // Group specifications by category
        const categories = {};
        this.specFramework.forEach(spec => {
            if (!categories[spec.category]) {
                categories[spec.category] = [];
            }
            categories[spec.category].push(spec);
        });
        
        Object.entries(categories).forEach(([category, specs]) => {
            html += `
                <div class="spec-category">
                    <h4>${category}</h4>
            `;
            
            specs.forEach(spec => {
                html += `
                    <div class="spec-item">
                        <span class="spec-name">${spec.name}</span>
                        <span class="spec-importance importance-${spec.importance}">${spec.importance}</span>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        specsDiv.innerHTML = html;
        
        document.getElementById('specFramework').classList.remove('hidden');
    }

    proceedToUpload() {
        document.getElementById('uploadSection').classList.remove('hidden');
        this.generateManualForm();
    }

    generateManualForm() {
        const manualForm = document.getElementById('manualForm');
        let html = '<div class="manual-form-grid">';
        
        // Add brand name first
        html += `<input type="text" id="manualBrand" placeholder="Brand Name" required>`;
        
        // Generate input fields for each specification
        this.specFramework.forEach(spec => {
            html += `
                <input type="text" 
                       id="manual_${spec.id}" 
                       placeholder="${spec.name}"
                       data-spec-id="${spec.id}"
                       data-spec-type="${spec.type}">
            `;
        });
        
        html += `
            </div>
            <button onclick="addManualProduct()" class="add-manual-btn">➕ Add Product to Comparison</button>
        `;
        
        manualForm.innerHTML = html;
    }

    async analyzeDocuments() {
        const files = document.getElementById('documentFiles').files;
        
        if (files.length === 0 && this.comparisonData.length === 0) {
            alert('Please upload documents or add products manually');
            return;
        }

        this.showAnalysisProgress(true);
        this.updateAnalysisStep('Starting document analysis...', 'working');

        try {
            // Process uploaded documents
            for (let file of files) {
                this.updateAnalysisStep(`Processing: ${file.name}`, 'working');
                const productData = await this.extractProductData(file);
                this.comparisonData.push(productData);
                this.updateAnalysisStep(`✓ Extracted data from: ${file.name}`, 'complete');
            }

            // Fill specification framework with extracted data
            this.fillComparisonTable();
            
            this.updateAnalysisStep('Analysis completed successfully', 'complete');
            this.showAnalysisProgress(false);
            this.displayComparisonResults();
            
        } catch (error) {
            this.updateAnalysisStep('Analysis failed: ' + error.message, 'error');
            console.error('Analysis failed:', error);
        }
    }

    async extractProductData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    let text = '';
                    
                    if (file.type === 'application/pdf') {
                        // PDF processing
                        const arrayBuffer = event.target.result;
                        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                        
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            text += pageText + '\n';
                        }
                    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
                        // Text file
                        text = event.target.result;
                    } else {
                        // Word documents and others - basic text extraction
                        text = event.target.result;
                    }
                    
                    const productData = this.aiResearcher.extractDataFromText(text, this.specFramework, this.productType);
                    productData.fileName = file.name;
                    productData.brand = productData.brand || this.extractBrandFromFilename(file.name);
                    
                    resolve(productData);
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            
            if (file.type === 'application/pdf') {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    extractBrandFromFilename(filename) {
        const brands = ['tke', 'otis', 'schindler', 'kone', 'mitsubishi', 'samsung', 'apple', 'lg', 'sony'];
        const filenameLower = filename.toLowerCase();
        
        for (let brand of brands) {
            if (filenameLower.includes(brand)) {
                return brand.toUpperCase();
            }
        }
        
        return 'Unknown';
    }

    updateAnalysisStep(message, status = 'working') {
        const stepsDiv = document.getElementById('analysisSteps');
        const stepItem = document.createElement('div');
        stepItem.className = `step-item ${status}`;
        stepItem.textContent = message;
        stepsDiv.appendChild(stepItem);
        stepsDiv.scrollTop = stepsDiv.scrollHeight;
    }

    fillComparisonTable() {
        // AI fills missing data and normalizes values
        this.comparisonData = this.aiResearcher.normalizeAndFillData(
            this.comparisonData, 
            this.specFramework
        );
        
        // AI analyzes and scores each product
        this.comparisonData = this.aiResearcher.analyzeProducts(
            this.comparisonData, 
            this.specFramework,
            this.productType,
            this.useCase
        );
    }

    displayComparisonResults() {
        this.displayProductSummary();
        this.displaySpecsComparison();
        this.displayPriceComparison();
        this.displayFeaturesComparison();
        this.displayAIRecommendations();
        
        document.getElementById('comparisonResults').classList.remove('hidden');
    }

    displayProductSummary() {
        const summaryDiv = document.getElementById('productSummary');
        const bestProduct = this.findBestProduct();
        
        summaryDiv.innerHTML = `
            <h3>${this.productType} Comparison for ${this.useCase}</h3>
            <p><strong>Products Compared:</strong> ${this.comparisonData.length}</p>
            <p><strong>AI Recommended:</strong> ${bestProduct.brand} (Score: ${bestProduct.aiScore}/100)</p>
        `;
    }

    displaySpecsComparison() {
        const specsDiv = document.getElementById('specsComparison');
        let html = '<table class="comparison-table"><tr><th>Specification</th>';
        
        // Headers
        this.comparisonData.forEach(product => {
            const isBest = product === this.findBestProduct();
            html += `<th ${isBest ? 'class="best-value"' : ''}>${product.brand}</th>`;
        });
        html += '</tr>';
        
        // Specification rows
        this.specFramework.forEach(spec => {
            if (spec.importance === 'high' || spec.importance === 'medium') {
                html += `<tr><td><strong>${spec.name}</strong></td>`;
                
                this.comparisonData.forEach(product => {
                    const value = product.specifications[spec.id] || 'Not specified';
                    let cellClass = '';
                    
                    if (value === 'Not specified') {
                        cellClass = 'missing-data';
                    } else if (this.isBestValue(product, spec.id)) {
                        cellClass = 'best-value';
                    }
                    
                    html += `<td class="${cellClass}">${value}</td>`;
                });
                
                html += '</tr>';
            }
        });
        
        html += '</table>';
        specsDiv.innerHTML = html;
    }

    displayPriceComparison() {
        const priceDiv = document.getElementById('priceComparison');
        let html = '<table class="comparison-table"><tr><th>Cost Factor</th>';
        
        this.comparisonData.forEach(product => {
            html += `<th>${product.brand}</th>`;
        });
        html += '</tr>';
        
        // Find price specification
        const priceSpec = this.specFramework.find(spec => 
            spec.name.toLowerCase().includes('price') || 
            spec.name.toLowerCase().includes('cost')
        );
        
        if (priceSpec) {
            html += `<tr><td><strong>${priceSpec.name}</strong></td>`;
            this.comparisonData.forEach(product => {
                const price = product.specifications[priceSpec.id];
                html += `<td>${price || 'Not specified'}</td>`;
            });
            html += '</tr>';
        }
        
        // Add value score
        html += `<tr><td><strong>AI Value Score</strong></td>`;
        this.comparisonData.forEach(product => {
            const score = product.aiScore || 0;
            let cellClass = '';
            if (score >= 80) cellClass = 'best-value';
            else if (score >= 60) cellClass = 'good-value';
            else cellClass = 'poor-value';
            
            html += `<td class="${cellClass}">${score}/100</td>`;
        });
        html += '</tr></table>';
        
        priceDiv.innerHTML = html;
    }

    displayFeaturesComparison() {
        const featuresDiv = document.getElementById('featuresComparison');
        let html = '<div class="features-grid">';
        
        this.comparisonData.forEach(product => {
            const isBest = product === this.findBestProduct();
            html += `
                <div class="feature-card ${isBest ? 'best-value' : ''}">
                    <h4>${product.brand} ${isBest ? '🏆' : ''}</h4>
                    <div class="feature-list">
            `;
            
            // Show key features
            const keyFeatures = Object.entries(product.specifications)
                .filter(([key, value]) => {
                    const spec = this.specFramework.find(s => s.id === key);
                    return spec && spec.importance === 'high' && value && value !== 'Not specified';
                })
                .slice(0, 8);
            
            keyFeatures.forEach(([key, value]) => {
                const spec = this.specFramework.find(s => s.id === key);
                html += `<div class="feature-item">✓ ${spec.name}: ${value}</div>`;
            });
            
            html += `
                    </div>
                    <div class="ai-score">AI Score: ${product.aiScore}/100</div>
                </div>
            `;
        });
        
        html += '</div>';
        featuresDiv.innerHTML = html;
    }

    displayAIRecommendations() {
        const aiDiv = document.getElementById('aiRecommendations');
        const bestProduct = this.findBestProduct();
        const analysis = this.aiResearcher.generateFinalRecommendation(
            this.comparisonData, 
            this.productType, 
            this.useCase
        );
        
        aiDiv.innerHTML = `
            <div class="ai-recommendation">
                <h3>🏆 AI Recommendation</h3>
                <p><strong>Best Choice:</strong> ${bestProduct.brand}</p>
                <p><strong>Score:</strong> ${bestProduct.aiScore}/100</p>
                <p><strong>Reasoning:</strong> ${analysis.reasoning}</p>
            </div>
            
            <div class="ai-insight">
                <h4>📊 Comparison Insights</h4>
                <p>${analysis.insights}</p>
            </div>
            
            <div class="ai-insight">
                <h4>💡 Key Considerations</h4>
                <ul>
                    ${analysis.considerations.map(consideration => 
                        `<li>${consideration}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="ai-insight">
                <h4>🎯 Next Steps</h4>
                <p>${analysis.nextSteps}</p>
            </div>
        `;
    }

    findBestProduct() {
        return this.comparisonData.reduce((best, current) => 
            (current.aiScore || 0) > (best.aiScore || 0) ? current : best
        );
    }

    isBestValue(product, specId) {
        const values = this.comparisonData
            .map(p => p.specifications[specId])
            .filter(v => v && v !== 'Not specified');
        
        if (values.length === 0) return false;
        
        const productValue = product.specifications[specId];
        return productValue === values.sort()[0]; // Simple comparison - can be enhanced
    }

    showResearchProgress(show) {
        document.getElementById('researchProgress').classList.toggle('hidden', !show);
    }

    showAnalysisProgress(show) {
        document.getElementById('analysisProgress').classList.toggle('hidden', !show);
    }

    saveToStorage() {
        try {
            const data = {
                productType: this.productType,
                useCase: this.useCase,
                specFramework: this.specFramework,
                comparisonData: this.comparisonData
            };
            localStorage.setItem('aiComparisonData', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save to localStorage');
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('aiComparisonData');
            if (saved) {
                const data = JSON.parse(saved);
                this.productType = data.productType;
                this.useCase = data.useCase;
                this.specFramework = data.specFramework;
                this.comparisonData = data.comparisonData;
                
                if (this.specFramework.length > 0) {
                    this.displaySpecificationFramework();
                    this.proceedToUpload();
                }
                if (this.comparisonData.length > 0) {
                    this.displayComparisonResults();
                }
            }
        } catch (e) {
            console.warn('Could not load from localStorage');
        }
    }
}

// Manual product addition
async function addManualProduct() {
    const brand = document.getElementById('manualBrand').value.trim();
    if (!brand) {
        alert('Please enter brand name');
        return;
    }

    const productData = {
        brand: brand,
        specifications: {},
        fileName: 'Manual Entry',
        timestamp: new Date().toISOString()
    };

    // Collect all manual inputs
    window.proposalManager.specFramework.forEach(spec => {
        const input = document.getElementById(`manual_${spec.id}`);
        if (input && input.value.trim()) {
            productData.specifications[spec.id] = input.value.trim();
        }
    });

    if (!window.proposalManager) {
        window.proposalManager = new AISmartComparisonSystem();
    }

    window.proposalManager.comparisonData.push(productData);
    
    // Re-analyze with new data
    window.proposalManager.fillComparisonTable();
    window.proposalManager.displayComparisonResults();
    window.proposalManager.saveToStorage();
    
    // Clear form
    document.getElementById('manualBrand').value = '';
    window.proposalManager.specFramework.forEach(spec => {
        const input = document.getElementById(`manual_${spec.id}`);
        if (input) input.value = '';
    });
    
    alert(`${brand} added to comparison!`);
}

// Tab navigation
function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    const tabButtons = document.getElementsByClassName('tab-button');
    
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Export function
function exportComparison() {
    if (!window.proposalManager || window.proposalManager.comparisonData.length === 0) {
        alert('No data to export');
        return;
    }

    let csv = 'Brand,';
    
    // Headers
    window.proposalManager.specFramework.forEach(spec => {
        if (spec.importance === 'high' || spec.importance === 'medium') {
            csv += `"${spec.name}",`;
        }
    });
    csv += 'AI Score\n';
    
    // Data
    window.proposalManager.comparisonData.forEach(product => {
        csv += `"${product.brand}",`;
        
        window.proposalManager.specFramework.forEach(spec => {
            if (spec.importance === 'high' || spec.importance === 'medium') {
                const value = product.specifications[spec.id] || 'Not specified';
                csv += `"${value}",`;
            }
        });
        
        csv += `${product.aiScore || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${window.proposalManager.productType}-comparison.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Global functions
function researchSpecifications() {
    if (!window.proposalManager) {
        window.proposalManager = new AISmartComparisonSystem();
    }
    window.proposalManager.researchSpecifications();
}

function proceedToUpload() {
    if (window.proposalManager) {
        window.proposalManager.proceedToUpload();
    }
}

function analyzeDocuments() {
    if (window.proposalManager) {
        window.proposalManager.analyzeDocuments();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.proposalManager = new AISmartComparisonSystem();
});