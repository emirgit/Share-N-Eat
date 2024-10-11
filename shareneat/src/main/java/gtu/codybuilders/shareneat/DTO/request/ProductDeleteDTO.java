package gtu.codybuilders.shareneat.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDeleteDTO {

    private Long id;
    private String name;
    private String brand;

}
