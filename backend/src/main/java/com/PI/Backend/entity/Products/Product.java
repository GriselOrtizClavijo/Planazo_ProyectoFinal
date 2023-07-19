package com.PI.Backend.entity.Products;

import com.PI.Backend.entity.Location.City;
import com.PI.Backend.entity.Reservations.Booking;
import com.PI.Backend.entity.Reviews.Review;
import com.PI.Backend.entity.users.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "Product")
@Setter
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idProduct", nullable = false)
	private int id;

	@JsonIgnoreProperties("products")
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "product_category", joinColumns = @JoinColumn(name = "idProduct"), inverseJoinColumns = @JoinColumn(name = "idCategory"))
	private Set<Category> categories;

	@ManyToOne
	@JoinColumn(name = "city_id", referencedColumnName = "id")
	@NonNull
	private City city;

	@OneToMany(fetch = FetchType.EAGER)
	@NonNull
	private List<Image> img;

	@NonNull
	@NotEmpty
	private String title;

	@NonNull
	private BigDecimal priceAdult;

	@NonNull
	private BigDecimal priceMinor;

	@Column(length = 1000)
	@NonNull
	private String description;

	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@NonNull
	@JsonIgnore
	private Set<Characteristic> characteristics;

	private int ranking;

	@NonNull
	private boolean availability;

	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private Set<Booking> bookings;

	@Column(length = 2000)
	private String policy;

	@Column
	private Double lat;
	@Column
	private Double lng;

	/*@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Review> reviews;*/

	@ManyToMany(mappedBy = "favorites", cascade = CascadeType.ALL)
	private List<Users> users;


	public Product(int id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Product product = (Product) o;
		return id == product.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

}
