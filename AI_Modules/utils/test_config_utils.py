# Create test file cat > test_config_utils.py << 'EOF'
from config import config
from utils import clean_amount, format_risk_level, generate_id

print("=" * 50)
print("TEST 1: Config & Utils")
print("=" * 50)

print(f"✅ Config loaded successfully")
print(f"   Base Directory: {config.BASE_DIR}")
print(f"   Risk Thresholds: {config.RISK_THRESHOLDS}")
print(f"   Supported States: {len(config.get_supported_states())} states")

print(f"\n✅ Helpers working:")
print(f"   Clean Amount '₹25,000' → {clean_amount('₹25,000')}")
print(f"   Risk Level (75) → {format_risk_level(75)}")
print(f"   Generated ID → {generate_id('TEST')}")
EOF

# Run test python test_config_utils.py
