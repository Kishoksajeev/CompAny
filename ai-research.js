class AIResearchEngine {
    constructor() {
        this.useRealAI = false; // Set to true when you have API key
        this.apiKey = 'your-openai-api-key-here';
    }

    async researchProductSpecifications(productType, useCase) {
        if (this.useRealAI && this.apiKey) {
            try {
                return await this.realAIResearch(productType, useCase);
            } catch (error) {
                console.warn('Real AI research failed, using mock data', error);
                return this.mockAIResearch(productType, useCase);
            }
        } else {
            return this.mockAIResearch(productType, useCase);
        }
    }

    async realAIResearch(productType, useCase) {
        const prompt = `
        Research and provide the most important specifications for comparing ${productType} for ${useCase}.
        
        Provide a comprehensive list of specifications grouped by category with:
        - Technical specifications
        - Performance metrics
        - Features and capabilities
        - Cost and commercial factors
        - Installation and maintenance requirements
        
        For each specification, include:
        - Unique ID (short, no spaces)
        - Name (clear description)
        - Category (Technical, Performance, Features, Commercial, etc.)
        - Importance (high, medium, low)
        - Type (text, number, currency, boolean, rating)
        
        Return as JSON array:
        [
            {
                "id": "capacity",
                "name": "Load Capacity",
                "category": "Technical",
                "importance": "high",
                "type": "number"
            }
        ]
        `;

        // This would call OpenAI API
        // For now, we'll use mock data
        return this.mockAIResearch(productType, useCase);
    }

    mockAIResearch(productType, useCase) {
        const productLower = productType.toLowerCase();
        const useCaseLower = useCase.toLowerCase();

        if (productLower.includes('elevator') || productLower.includes('lift')) {
            return this.getElevatorSpecifications(useCaseLower);
        } else if (productLower.includes('phone') || productLower.includes('smartphone')) {
            return this.getSmartphoneSpecifications(useCaseLower);
        } else if (productLower.includes('laptop') || productLower.includes('notebook')) {
            return this.getLaptopSpecifications(useCaseLower);
        } else if (productLower.includes('air conditioner') || productLower.includes('ac')) {
            return this.getACSpecifications(useCaseLower);
        } else {
            // Generic product specifications
            return this.getGenericSpecifications(productType, useCaseLower);
        }
    }

    getElevatorSpecifications(useCase) {
        return [
            // Technical Specifications
            { id: 'capacity', name: 'Load Capacity (KG)', category: 'Technical', importance: 'high', type: 'number' },
            { id: 'speed', name: 'Speed (MPS)', category: 'Technical', importance: 'high', type: 'number' },
            { id: 'stops', name: 'Number of Stops', category: 'Technical', importance: 'high', type: 'number' },
            { id: 'travel_distance', name: 'Travel Distance (m)', category: 'Technical', importance: 'medium', type: 'number' },
            { id: 'machine_type', name: 'Machine Type', category: 'Technical', importance: 'high', type: 'text' },
            { id: 'control_system', name: 'Control System', category: 'Technical', importance: 'high', type: 'text' },
            
            // Dimensions
            { id: 'car_size', name: 'Car Size (WxD)', category: 'Dimensions', importance: 'high', type: 'text' },
            { id: 'door_size', name: 'Door Size (WxH)', category: 'Dimensions', importance: 'high', type: 'text' },
            { id: 'shaft_size', name: 'Shaft Size (WxD)', category: 'Dimensions', importance: 'high', type: 'text' },
            { id: 'pit_depth', name: 'Pit Depth (mm)', category: 'Dimensions', importance: 'medium', type: 'number' },
            { id: 'overhead', name: 'Overhead Height (mm)', category: 'Dimensions', importance: 'medium', type: 'number' },
            
            // Safety Features
            { id: 'safety_gear', name: 'Safety Gear System', category: 'Safety', importance: 'high', type: 'text' },
            { id: 'emergency_brake', name: 'Emergency Brake', category: 'Safety', importance: 'high', type: 'boolean' },
            { id: 'fire_operation', name: 'Fire Emergency Operation', category: 'Safety', importance: 'high', type: 'boolean' },
            { id: 'rescue_device', name: 'Automatic Rescue Device', category: 'Safety', importance: 'medium', type: 'boolean' },
            { id: 'overspeed', name: 'Overspeed Protection', category: 'Safety', importance: 'high', type: 'boolean' },
            
            // Commercial
            { id: 'total_price', name: 'Total Price', category: 'Commercial', importance: 'high', type: 'currency' },
            { id: 'warranty', name: 'Warranty Period (months)', category: 'Commercial', importance: 'high', type: 'number' },
            { id: 'delivery_time', name: 'Delivery Time', category: 'Commercial', importance: 'medium', type: 'text' },
            { id: 'installation_time', name: 'Installation Time', category: 'Commercial', importance: 'medium', type: 'text' },
            { id: 'maintenance_cost', name: 'Annual Maintenance Cost', category: 'Commercial', importance: 'medium', type: 'currency' },
            
            // Features
            { id: 'energy_efficiency', name: 'Energy Efficiency Rating', category: 'Features', importance: 'medium', type: 'text' },
            { id: 'display_type', name: 'Display Type', category: 'Features', importance: 'low', type: 'text' },
            { id: 'accessibility', name: 'Accessibility Features', category: 'Features', importance: 'medium', type: 'text' },
            { id: 'emergency_lighting', name: 'Emergency Lighting', category: 'Features', importance: 'medium', type: 'boolean' },
            { id: 'ventilation', name: 'Ventilation System', category: 'Features', importance: 'low', type: 'boolean' }
        ];
    }

    getSmartphoneSpecifications(useCase) {
        return [
            { id: 'display_size', name: 'Display Size (inches)', category: 'Display', importance: 'high', type: 'number' },
            { id: 'resolution', name: 'Resolution', category: 'Display', importance: 'high', type: 'text' },
            { id: 'processor', name: 'Processor', category: 'Performance', importance: 'high', type: 'text' },
            { id: 'ram', name: 'RAM (GB)', category: 'Performance', importance: 'high', type: 'number' },
            { id: 'storage', name: 'Storage (GB)', category: 'Storage', importance: 'high', type: 'number' },
            { id: 'camera_main', name: 'Main Camera (MP)', category: 'Camera', importance: 'high', type: 'number' },
            { id: 'battery', name: 'Battery Capacity (mAh)', category: 'Battery', importance: 'high', type: 'number' },
            { id: 'price', name: 'Price', category: 'Commercial', importance: 'high', type: 'currency' }
        ];
    }

    getGenericSpecifications(productType, useCase) {
        return [
            { id: 'price', name: 'Price', category: 'Commercial', importance: 'high', type: 'currency' },
            { id: 'warranty', name: 'Warranty', category: 'Commercial', importance: 'high', type: 'text' },
            { id: 'brand', name: 'Brand', category: 'General', importance: 'medium', type: 'text' },
            { id: 'model', name: 'Model', category: 'General', importance: 'medium', type: 'text' },
            { id: 'weight', name: 'Weight', category: 'Physical', importance: 'medium', type: 'number' },
            { id: 'dimensions', name: 'Dimensions', category: 'Physical', importance: 'medium', type: 'text' },
            { id: 'power_consumption', name: 'Power Consumption', category: 'Technical', importance: 'medium', type: 'text' },
            { id: 'features', name: 'Key Features', category: 'Features', importance: 'medium', type: 'text' }
        ];
    }

    extractDataFromText(text, specFramework, productType) {
        const normalizedText = text.toLowerCase();
        const productData = {
            brand: this.extractBrand(normalizedText),
            specifications: {},
            features: [],
            rawText: text.substring(0, 2000)
        };

        // Extract data for each specification
        specFramework.forEach(spec => {
            const value = this.extractSpecificationValue(normalizedText, spec, productType);
            if (value) {
                productData.specifications[spec.id] = value;
            }
        });

        return productData;
    }

    extractBrand(text) {
        const brandPatterns = {
            elevator: ['tk elevator', 'tke', 'otis', 'schindler', 'kone', 'mitsubishi', 'hitachi'],
            smartphone: ['samsung', 'apple', 'iphone', 'xiaomi', 'oneplus', 'google', 'pixel'],
            laptop: ['dell', 'hp', 'lenovo', 'apple', 'macbook', 'asus', 'acer'],
            generic: ['samsung', 'lg', 'sony', 'panasonic', 'philips', 'bosch', 'siemens']
        };

        for (const [category, brands] of Object.entries(brandPatterns)) {
            for (const brand of brands) {
                if (text.includes(brand)) {
                    return brand.toUpperCase();
                }
            }
        }

        return this.extractBrandFromContext(text);
    }

    extractBrandFromContext(text) {
        // Simple brand extraction from common patterns
        const brandMatch = text.match(/(brand|make|manufacturer).*?([a-z\s]{2,20})/i);
        return brandMatch ? brandMatch[2].trim().toUpperCase() : 'UNKNOWN';
    }

    extractSpecificationValue(text, spec, productType) {
        const patterns = this.getExtractionPatterns(spec, productType);
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return this.normalizeValue(match[1].trim(), spec.type);
            }
        }
        
        return null;
    }

    getExtractionPatterns(spec, productType) {
        const basePatterns = [
            new RegExp(`${spec.name}.*?([^\\s]+)`, 'i'),
            new RegExp(`${spec.id}.*?([^\\s]+)`, 'i'),
        ];

        // Product-specific patterns
        if (productType.toLowerCase().includes('elevator')) {
            basePatterns.push(
                new RegExp(`capacity.*?(\\d+).*?kg`, 'i'),
                new RegExp(`speed.*?(\\d+(?:\\.\\d+)?).*?mps`, 'i'),
                new RegExp(`stops.*?(\\d+)`, 'i')
            );
        }

        return basePatterns;
    }

    normalizeValue(value, type) {
        switch (type) {
            case 'number':
                return value.replace(/[^\d.]/g, '');
            case 'currency':
                return value.replace(/[^\d.]/g, '');
            case 'boolean':
                return value.toLowerCase().includes('yes') || value.toLowerCase().includes('true') || value === '1' ? 'Yes' : 'No';
            default:
                return value;
        }
    }

    normalizeAndFillData(products, specFramework) {
        return products.map(product => {
            const normalizedProduct = { ...product };
            
            // Ensure all specifications have values or 'Not specified'
            specFramework.forEach(spec => {
                if (!normalizedProduct.specifications[spec.id]) {
                    normalizedProduct.specifications[spec.id] = 'Not specified';
                }
            });
            
            return normalizedProduct;
        });
    }

    analyzeProducts(products, specFramework, productType, useCase) {
        return products.map(product => {
            const analysis = this.calculateProductScore(product, specFramework, productType, useCase);
            return {
                ...product,
                aiScore: analysis.score,
                aiAnalysis: analysis
            };
        });
    }

    calculateProductScore(product, specFramework, productType, useCase) {
        let score = 50; // Base score
        
        // Score based on specification completeness
        const totalSpecs = specFramework.length;
        const filledSpecs = Object.values(product.specifications).filter(
            value => value && value !== 'Not specified'
        ).length;
        
        const completeness = (filledSpecs / totalSpecs) * 30;
        score += completeness;
        
        // Score based on important specifications
        const importantSpecs = specFramework.filter(spec => spec.importance === 'high');
        let importantScore = 0;
        
        importantSpecs.forEach(spec => {
            if (product.specifications[spec.id] && product.specifications[spec.id] !== 'Not specified') {
                importantScore += 10;
            }
        });
        
        score += Math.min(importantScore, 30);
        
        // Brand reputation bonus
        if (this.isReputedBrand(product.brand, productType)) {
            score += 10;
        }
        
        return {
            score: Math.min(100, Math.round(score)),
            completeness: Math.round((filledSpecs / totalSpecs) * 100),
            importantSpecsCovered: importantSpecs.filter(spec => 
                product.specifications[spec.id] && product.specifications[spec.id] !== 'Not specified'
            ).length
        };
    }

    isReputedBrand(brand, productType) {
        const reputedBrands = {
            elevator: ['TKE', 'OTIS', 'SCHINDLER', 'KONE'],
            smartphone: ['APPLE', 'SAMSUNG', 'GOOGLE'],
            laptop: ['APPLE', 'DELL', 'HP', 'LENOVO'],
            generic: ['SIEMENS', 'BOSCH', 'PHILIPS', 'SONY']
        };
        
        const productKey = Object.keys(reputedBrands).find(key => 
            productType.toLowerCase().includes(key)
        ) || 'generic';
        
        return reputedBrands[productKey].includes(brand.toUpperCase());
    }

    generateFinalRecommendation(products, productType, useCase) {
        const bestProduct = products.reduce((best, current) => 
            (current.aiScore || 0) > (best.aiScore || 0) ? current : best
        );
        
        return {
            reasoning: `${
                bestProduct.brand
            } offers the best balance of specifications and value for ${
                useCase
            }. With an AI score of ${
                bestProduct.aiScore
            }/100, it provides comprehensive features at competitive pricing.`,
            
            insights: `Based on analysis of ${
                products.length
            } products, ${
                bestProduct.brand
            } leads in specification completeness and meets the requirements for ${
                useCase
            } most effectively.`,
            
            considerations: [
                'Verify actual product availability and delivery timelines',
                'Check after-sales service and support in your region',
                'Confirm warranty terms and conditions',
                'Compare installation requirements if applicable',
                'Review user reviews and ratings for real-world performance'
            ],
            
            nextSteps: `Contact ${
                bestProduct.brand
            } for final pricing and proceed with purchase negotiations. Ensure all specifications match your requirements before finalizing.`
        };
    }
}