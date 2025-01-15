package gtu.codybuilders.shareneat.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadProductDTO {

    private String name;
    private String brand;
    private String category;
}
