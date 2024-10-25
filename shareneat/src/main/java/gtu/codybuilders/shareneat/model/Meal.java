package gtu.codybuilders.shareneat.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mealId;
    private String name;
    private Post post;

    @ElementCollection
    @CollectionTable(name = "meal_products", joinColumns = @JoinColumn(name = "meal_id"))
    @MapKeyJoinColumn(name = "product_id")
    @Column(name = "quantity")
    private Map<Product, Double> productsWithQuantities = new HashMap<>(); // Stores products and their quantities

    // Total nutritive values
    private Double totalCalories;
    private Double totalProtein;
    private Double totalCarbohydrates;
    private Double totalFats;
    private Double totalFiber;
    private Double totalSugar;

    // Calculate nutritive values from products and their quantities
    public void calculateNutrition() {
        totalCalories = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getCalories() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
        totalProtein = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getProtein() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
        totalCarbohydrates = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getCarbohydrates() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
        totalFats = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getFats() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
        totalFiber = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getFiber() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
        totalSugar = productsWithQuantities.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getSugar() * (entry.getValue() / entry.getKey().getGrams()))
                .sum();
    }
}

