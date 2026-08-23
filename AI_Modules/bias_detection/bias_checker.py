"""
Bias Detection and Correction System
Monitors and corrects algorithmic bias across regions, industries, and business sizes
"""

import json
from collections import defaultdict

class BiasChecker:
    """Monitor and correct algorithmic bias"""
    
    def __init__(self):
        self.decision_log = []
        self.fairness_thresholds = {
            'max_disparity_ratio': 1.5,
            'min_sample_size': 10,
            'allowed_deviation': 0.15
        }
    
    def log_decision(self, company_id, region, industry, business_size, risk_score, decision):
        """
        Log each decision for bias monitoring
        """
        self.decision_log.append({
            'company_id': company_id,
            'region': region,
            'industry': industry,
            'business_size': business_size,
            'risk_score': risk_score,
            'decision': decision
        })
    
    def get_group_stats(self):
        """
        Calculate statistics for each group
        """
        stats = {
            'by_region': defaultdict(list),
            'by_industry': defaultdict(list),
            'by_size': defaultdict(list)
        }
        
        for log in self.decision_log:
            stats['by_region'][log['region']].append(log['risk_score'])
            stats['by_industry'][log['industry']].append(log['risk_score'])
            stats['by_size'][log['business_size']].append(log['risk_score'])
        
        return stats
    
    def check_bias(self):
        """
        Check for bias across all dimensions
        
        Returns:
            dict: Bias detection results
        """
        stats = self.get_group_stats()
        results = {
            'bias_detected': False,
            'alerts': []
        }
        
        for dimension, groups in stats.items():
            group_avg = {}
            
            for group, scores in groups.items():
                if len(scores) >= self.fairness_thresholds['min_sample_size']:
                    avg_score = sum(scores) / len(scores)
                    group_avg[group] = avg_score
            
            if len(group_avg) >= 2:
                max_score = max(group_avg.values())
                min_score = min(group_avg.values())
                
                if min_score > 0 and (max_score / min_score) > self.fairness_thresholds['max_disparity_ratio']:
                    results['bias_detected'] = True
                    results['alerts'].append({
                        'dimension': dimension,
                        'group_averages': group_avg,
                        'disparity_ratio': max_score / min_score,
                        'recommendation': f'Review {dimension} targeting. Adjust scores for fairness.'
                    })
        
        return results
    
    def adjust_risk_score(self, company_id, region, industry, business_size, risk_score):
        """
        Apply bias correction to risk score
        
        Returns:
            dict: {
                'original_score': float,
                'adjusted_score': float,
                'adjustment_applied': bool,
                'reason': str
            }
        """
        adjusted_score = risk_score
        adjustment_applied = False
        reason = "No adjustment needed"
        
        # Check current bias
        bias_report = self.check_bias()
        
        if bias_report['bias_detected']:
            for alert in bias_report['alerts']:
                dimension = alert['dimension']
                group_avg = alert['group_averages']
                
                # Determine if this company is in a disadvantaged group
                if dimension == 'by_region' and region in group_avg:
                    avg_score = group_avg[region]
                    if avg_score > risk_score + 10:  # Group has higher average
                        adjustment = 0.85  # Reduce score
                        adjusted_score = risk_score * adjustment
                        adjustment_applied = True
                        reason = f"Bias correction: {region} region scores adjusted"
                
                elif dimension == 'by_industry' and industry in group_avg:
                    avg_score = group_avg[industry]
                    if avg_score > risk_score + 10:
                        adjustment = 0.85
                        adjusted_score = risk_score * adjustment
                        adjustment_applied = True
                        reason = f"Bias correction: {industry} industry adjusted"
                
                elif dimension == 'by_size' and business_size in group_avg:
                    avg_score = group_avg[business_size]
                    if avg_score > risk_score + 10 and business_size == 'small':
                        adjustment = 0.80
                        adjusted_score = risk_score * adjustment
                        adjustment_applied = True
                        reason = f"Bias correction: Small businesses adjusted"
        
        return {
            'original_score': risk_score,
            'adjusted_score': round(adjusted_score, 2),
            'adjustment_applied': adjustment_applied,
            'reason': reason
        }
    
    def get_fairness_report(self):
        """
        Get comprehensive fairness report
        """
        stats = self.get_group_stats()
        bias_check = self.check_bias()
        
        report = {
            'total_decisions': len(self.decision_log),
            'bias_detected': bias_check['bias_detected'],
            'alerts': bias_check['alerts'],
            'group_statistics': {}
        }
        
        for dimension, groups in stats.items():
            report['group_statistics'][dimension] = {}
            for group, scores in groups.items():
                if scores:
                    report['group_statistics'][dimension][group] = {
                        'count': len(scores),
                        'avg_score': sum(scores) / len(scores),
                        'min_score': min(scores),
                        'max_score': max(scores)
                    }
        
        return report
