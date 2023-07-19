package com.PI.Backend.entity.Products;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "Category")
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Category {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCategory")
	private int id;

	@JsonIgnoreProperties("categories")
	@ManyToMany(mappedBy = "categories", fetch = FetchType.EAGER)
	private List<Product> products;


	private String title;

	private String description;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "imagen_id")
	@NonNull
	private Image image;

	private String video;

	private boolean isActive;

}