package com.PI.Backend.entity.Location;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Province")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Province {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idProvincia", nullable = false)
	private int id;

	@OneToMany(mappedBy = "province")
	@JsonIgnore
	private List<City> cities;

	private String name;
}
