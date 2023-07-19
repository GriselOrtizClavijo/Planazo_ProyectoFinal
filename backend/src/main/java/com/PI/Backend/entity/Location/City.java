package com.PI.Backend.entity.Location;

import com.PI.Backend.entity.Products.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "City")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class City {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private int id;

	private String name;

	@ManyToOne
	@JoinColumn(name = "provinceId")
	private Province province;

	@OneToMany(mappedBy = "city")
	@JsonIgnore
	private List<Product> products;

}
