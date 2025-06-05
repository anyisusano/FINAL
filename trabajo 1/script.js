    document.addEventListener("DOMContentLoaded", async () => {
          try {
            const random = Math.floor(Math.random() * 400) + 1;
            const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`);
            const pokemon = res.data;
            console.log(res.data)

            const debilidades = await axios.get(pokemon.types[0].type.url);
              
            // Título y sprite
            document.getElementById("titulo").textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            
             document.getElementById("pok").src = pokemon.sprites.other.dream_world.front_default;
    document.getElementById("poke").src = pokemon.sprites.other.showdown.front_shiny




            // Altura, peso, número (convertir a unidades más legibles)
            document.getElementById("altura").textContent = `Height: ${pokemon.height / 10}m`;
            document.getElementById("peso").textContent = `Weight: ${pokemon.weight / 10}kg`;
            document.getElementById("numero").textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

            // Tipos y colores
            const pokemonTypes = {
              normal: "#A8A77A",
              fire: "#EE8130",
              water: "#6390F0",
              grass: "#7AC74C",
              electric: "#F7D02C",
              ice: "#96D9D6",
              fighting: "#C22E28",
              poison: "#A33EA1",
              ground: "#E2BF65",
              flying: "#A98FF3",
              psychic: "#F95587",
              bug: "#A6B91A",
              rock: "#B6A136",
              ghost: "#735797",
              dragon: "#6F35FC",
              dark: "#705746",
              steel: "#B7B7CE",
              fairy: "#D685AD"
            };

            const tiposContainer = document.getElementById("tipos");
            tiposContainer.innerHTML = "";
            const tonos = [];

            pokemon.types.forEach(({ type }) => {
              const tipoColor = pokemonTypes[type.name];
              if (tipoColor) {
                tonos.push(tipoColor);
                const button = document.createElement('button');
                button.textContent = type.name;
                button.style.backgroundColor = tipoColor;
                tiposContainer.appendChild(button);
              }
            });

            const pok = document.getElementById("pok");
            if (tonos.length >= 2) {
              pok.style.background = `linear-gradient(to bottom right, ${tonos[0]}, ${tonos[1]})`;
            } else if (tonos.length === 1) {
              pok.style.backgroundColor = tonos[0];
            }
    const poke = document.getElementById("poke");
            if (tonos.length >= 2) {
              poke.style.background = `linear-gradient(to bottom right, ${tonos[0]}, ${tonos[1]})`;

            } else if (tonos.length === 1) {
              poke.style.backgroundColor = tonos[0];
            }

            const body = document.getElementById("body");
            if (tonos.length >= 2) {
              body.style.background = `linear-gradient(to bottom right, ${tonos[0]}, ${tonos[1]})`;

            } else if (tonos.length === 1) {
              body.style.backgroundColor = tonos[0];
            }

            // Estadísticas
            const stats = pokemon.stats;
            const statIds = ["hp", "atackk", "defense", "special-atackk", "speed"];
            const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Speed"];

            statIds.forEach((id, index) => {
              const valor = stats[index].base_stat;
              document.getElementById(id).textContent = `${statNames[index]}: ${valor}`;
              const barra = document.getElementById(`barra${index + 1}`);
              const porcentaje = (valor / 255) * 100; // 255 es el stat máximo posible
              barra.style.width = porcentaje + "%";
              barra.setAttribute('data-value', valor);
              
              // Cambiar color según el valor
              if (valor < 50) {
                barra.style.backgroundColor = "#FF5252"; // Rojo para stats bajos
              } else if (valor < 80) {
                barra.style.backgroundColor = "#FFD740"; // Amarillo para stats medios
              } else {
                barra.style.backgroundColor = "#4CAF50"; // Verde para stats altos
              }
            });

            // Debilidades
            const tipossContainer = document.getElementById("tiposs");
            tipossContainer.innerHTML = "";
            debilidades.data.damage_relations.double_damage_from.forEach(t => {
              const tipoColor = pokemonTypes[t.name];
              if (tipoColor) {
                const button = document.createElement('button');
                button.textContent = t.name;
                button.style.backgroundColor = tipoColor;
                tipossContainer.appendChild(button);
              }
            });

          } catch (error) {
            console.error("Error al cargar el Pokémon:", error);
            alert("Error al cargar el Pokémon. Por favor, recarga la página.");
          }
        });