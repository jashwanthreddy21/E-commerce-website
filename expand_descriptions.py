import random
import os
from backend.database import SessionLocal
from backend.models import Product

def expand_descriptions():
    db = SessionLocal()
    products = db.query(Product).all()
    count = 0
    
    print(f"Loaded {len(products)} products. Expanding descriptions to 300+ words...")

    intros = [
        "Prepare to be amazed by the ultimate technological breakthrough in modern product design.",
        "Step into the future with a device engineered to completely transform your daily workflow.",
        "Uncompromising quality meets breathtaking aesthetics in this meticulously crafted flagship model.",
        "Engineered for professionals and enthusiasts alike, this device shatters previous boundaries of performance.",
        "Experience a paradigm shift in capability with our most advanced architectural product iteration to date."
    ]

    mid_sections = [
        "This product is built from aerospace-grade materials, ensuring a ridiculously long lifespan without sacrificing mobility. Its internal processing unit has been custom-tuned to handle heavy, demanding workloads simultaneously without thermal throttling. Whether you are deeply engaged in high-end creative tasks, managing massive datasets, or simply enjoying top-tier entertainment, the fluid responsiveness will keep you immersed. Furthermore, energy-efficient algorithms dynamically adjust power consumption, ensuring you are never left reaching for a charger midway through a critical task. It combines raw power with an elegant, minimalist form factor that feels perfectly balanced.",
        "Underneath the sleek, sophisticated chassis lies a thermal routing system that redefines heat management. You can push this device to its absolute limits for hours, and it will remain cool to the touch. The tactile feedback mechanisms implemented throughout the design provide a profoundly satisfying interaction layer, bridging the physical and digital divide seamlessly. Its connectivity suite supports extremely high-bandwidth transfer rates, making data latency a thing of the past. Integrated intelligent sensors continuously optimize the environmental variables, adapting contrast, sound, and power delivery to perfectly match your ambient surroundings in real time.",
        "What truly sets this apart is the massive array of customizable configurations embedded directly into its core firmware. You are completely in control. The bespoke engineering allows for sweeping personalization, ensuring it adapts to your unique ergonomic needs rather than you adapting to it. Additionally, the structural integrity has undergone military-grade stress testing, proving its resilience against drops, spills, and extreme temperatures. Utilizing an incredibly fast logic board, it natively renders complex computations in a fraction of previous generation times. This is not just an upgrade; it is an entirely new category of performance."
    ]
    
    details_1 = [
        "Beyond its core capabilities, we have heavily invested in sustainability. The outer shell is composed of 85% recycled alloy, yet it retains a tensile strength superior to traditional plastics. Every surface has been treated with a high-resistance oleophobic coating, drastically reducing fingerprint smudges and maintaining a pristine look.",
        "Connectivity is paramount in the modern era. That is why this includes ultra-low-latency wireless modules that establish rock-solid connections even in crowded digital environments. The acoustic chamber has also been redesigned, delivering rich, spatial soundscapes that provide astonishing clarity and a surprisingly deep bass response for its size.",
        "Security is woven into the very fabric of the hardware. Utilizing an encrypted enclave, your biometric and personal data is locked entirely offline. Any attempt to tamper mechanically triggers a localized lock. Pair that with a breathtakingly high-refresh rate panel, and you have a secure, vividly smooth window into your digital ecosystem."
    ]
    
    details_2 = [
        "It doesn't end there. The packaging has been entirely redesigned to eliminate single-use plastics, and the user manual is dynamically loaded straight from the firmware to reduce paper waste. The proprietary battery technology supports hyper-fast charging, providing up to 50% capacity in merely 15 minutes of being plugged in.",
        "For creative professionals, the color-accuracy calibration is performed right at the factory line. It covers 100% of the DCI-P3 gamut, meaning what you see is strictly what you get. Paired with intuitive, tactile physical controls alongside intelligent voice-assistant integration, controlling your environment has never been more fluid.",
        "Maintenance is miraculously simple. Rather than using copious amounts of glue, we utilize specialized precision screws and modular internal bays. This fundamentally champions the right to repair, ensuring your investment remains viable for nearly a decade. This commitment to longevity is central to our design philosophy."
    ]

    conclusion = [
        "In conclusion, investing in this technological masterpiece means investing in unparalleled reliability, stunning aesthetics, and blistering performance. It is meticulously designed to elevate your capabilities to entirely new heights.",
        "Ultimately, this represents the pinnacle of modern engineering. It refuses to compromise, offering elite tier specifications wrapped in a gorgeous silhouette. Do not settle for mediocrity when perfection is within reach.",
        "To summarize, this device is an absolute powerhouse. From its durable construction to its intelligent software integration, it provides an exquisite user experience that continually rewards you the more you use it. It is truly a masterclass in product design."
    ]

    for product in products:
        p_name = product.name
        
        # Build a massive description (~250 - 400 words)
        parts = [
            f"{random.choice(intros)} The {p_name} is exclusively designed to empower you like never before.",
            random.choice(mid_sections),
            random.choice(details_1),
            random.choice(details_2),
            random.choice(conclusion)
        ]
        
        massive_text = "\n\n".join(parts)
        product.description = massive_text
        
        count += 1
        if count % 100 == 0:
            db.commit()
            print(f"Updated {count} descriptions...")
            
    db.commit()
    db.close()
    print("Done! Massive detailed product descriptions are inserted.")

if __name__ == "__main__":
    expand_descriptions()
