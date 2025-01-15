package gtu.codybuilders.shareneat.service.impl;

import gtu.codybuilders.shareneat.dto.SiteSettingsDTO;
import gtu.codybuilders.shareneat.model.SiteSettings;
import gtu.codybuilders.shareneat.repository.SiteSettingsRepository;
import gtu.codybuilders.shareneat.service.SiteSettingsService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    /**
     * Initializes default site settings if none exist in the database.
     */
    @PostConstruct
    public void initializeDefaultSettings() {
        if (siteSettingsRepository.count() == 0) {
            SiteSettings defaultSettings = SiteSettings.builder()
                    .termsOfService("""
                        Terms of Service
                        
                        Welcome to Share'N Eat! By accessing or using our platform, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
                        
                        1. **Acceptance of Terms**
                           By creating an account, accessing, or using Share'N Eat, you agree to these Terms of Service. If you do not agree, please do not use the platform.
                        
                        2. **User Accounts**
                           - Users must provide accurate and complete information during registration.
                           - You are responsible for maintaining the confidentiality of your login credentials.
                           - You must immediately notify us of any unauthorized use of your account.
                        
                        3. **User Responsibilities**
                           - You agree not to post harmful, offensive, or inappropriate content.
                           - Sharing misleading health advice or unauthorized promotions is strictly prohibited.
                           - You are responsible for ensuring that your shared recipes and content comply with applicable laws.
                        
                        4. **Content Ownership**
                           - Users retain ownership of their content but grant Share'N Eat a non-exclusive, royalty-free license to use, display, and distribute the content within the platform.
                           - Share'N Eat may remove content that violates these terms or is deemed inappropriate.
                        
                        5. **Prohibited Activities**
                           - Uploading harmful software, spam, or unauthorized advertising.
                           - Impersonation or unauthorized use of another user’s account.
                           - Attempting to disrupt or harm the platform’s operation.
                        
                        6. **Account Termination**
                           - Share'N Eat reserves the right to suspend or terminate user accounts that violate these Terms of Service without prior notice.
                        
                        7. **Limitation of Liability**
                           - Share'N Eat is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of the platform. All health-related content is for informational purposes only and should not replace professional medical advice.
                        
                        8. **Modifications**
                           - We reserve the right to update these Terms of Service at any time. Continued use of Share'N Eat after changes indicates your acceptance of the updated terms.
                        
                        **Effective Date:** 15.01.2024  
                        **Last Updated:** 15.01.2024
                        """)
                    .privacyPolicy("""
                        Privacy Policy
                        
                        At Share'N Eat, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.
                        
                        1. **Information We Collect**
                           - **Personal Information:** Name, email address, profile information, and other data provided during registration.
                           - **Content Information:** Posts, comments, ratings, and interactions on the platform.
                           - **Usage Data:** Information on how you interact with the platform, including search queries, liked posts, and shared content.
                           - **Cookies and Tracking:** We use cookies to improve your user experience.
                        
                        2. **How We Use Your Information**
                           - To provide and personalize our services.
                           - To communicate with you regarding updates, promotions, or support inquiries.
                           - To improve platform functionality through analytics and user feedback.
                        
                        3. **Data Sharing and Disclosure**
                           - **Third-Party Services:** We may use third-party services (e.g., for email verification) but will never sell your data.
                           - **Legal Compliance:** We may disclose information if required by law or to protect the rights and safety of users.
                        
                        4. **Data Security**
                           - We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, or destruction.
                        
                        5. **User Rights**
                           - **Access and Correction:** You may access and update your personal information at any time.
                           - **Data Deletion:** You can request the deletion of your account and associated data.
                        
                        6. **Changes to This Policy**
                           - We may update this Privacy Policy to reflect changes in our practices. We will notify you of significant changes through the platform.
                        
                        For any questions regarding this Privacy Policy, please contact us at [shareneattrial@gmail.com].
                        
                        **Effective Date:** 15.01.2024  
                        **Last Updated:** 15.01.2024
                        """)
                    .build();
            siteSettingsRepository.save(defaultSettings);
        }
    }

    @Override
    public SiteSettings getSiteSettings() {
        return siteSettingsRepository.findTopByOrderByIdAsc();
    }

    @Override
    public SiteSettings updateSiteSettings(SiteSettingsDTO siteSettingsDTO) {
        SiteSettings existingSettings = siteSettingsRepository.findTopByOrderByIdAsc();
        if (existingSettings == null) {
            // In case no settings exist, create a new one
            existingSettings = SiteSettings.builder().build();
        }
        existingSettings.setTermsOfService(siteSettingsDTO.getTermsOfService());
        existingSettings.setPrivacyPolicy(siteSettingsDTO.getPrivacyPolicy());
        return siteSettingsRepository.save(existingSettings);
    }
}
