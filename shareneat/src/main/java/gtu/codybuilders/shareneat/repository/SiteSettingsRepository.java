package gtu.codybuilders.shareneat.repository;

import gtu.codybuilders.shareneat.model.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {

    // Retrieves the first SiteSettings entry, assuming only one exists
    SiteSettings findTopByOrderByIdAsc();
}
