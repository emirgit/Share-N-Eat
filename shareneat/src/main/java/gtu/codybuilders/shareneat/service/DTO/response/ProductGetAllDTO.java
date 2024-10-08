package gtu.codybuilders.shareneat.service.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductGetAllDTO {

    private Long id;
    private String name;
    private String brand;
}
