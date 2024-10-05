<template>
    <div id="app">
      <div class="authors-section">
        <div v-for="(author, index) in authors" :key="index" class="author">
          <img :src="author.image" alt="Foto do autor">
          <h3>{{ author.name }}</h3>
          <a :href="author.link" target="_blank" rel="noopener noreferrer">
            <p>{{ author.description }}</p>
          </a>
        </div>
      </div>
    </div>
  </template>

<script>
import fotoAnna from "@/assets/foto-anna.jpg";
import fotoNicolas from "@/assets/foto-nicolas.jpg";
import fotoNikoli from "@/assets/foto-nikoli.jpg";
import fotoNovo3 from "@/assets/foto-novo3.jpg";
import fotoNovo4 from "@/assets/foto-christopher.jpg";
import fotoNovo5 from "@/assets/foto-kaike.jpg";
import fotoNovo5 from "@/assets/foto-kaike.jpg";


export default {
    components: {

    },
    data() {
        return {
            authors: [
                {
                    name: "Anna Julia Lopes",
                    image: fotoAnna,
                    link: "https://www.instagram.com/anna.julia_015?igsh=MTg2dmZ2NG95Z3Z4dg==",
                    description:
                        "Discente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
                {
                    name: "Nicolas Bordini",
                    image: fotoNicolas,
                    link: "https://www.instagram.com/nicolas.bordinii?igsh=MXdxOGx3NThmeTN2bA==",
                    description:
                        "Discente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
                {
                    name: "Nikoli Azevedo",
                    image: fotoNikoli,
                    link: "https://www.instagram.com/nikoli_azevedo?igsh=MW4xM29qY2s0emZqaQ==",
                    description:
                        "Discente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
                {
                    name: "Christopher",
                    image: fotoNovo4,
                    link: "https://www.instagram.com/novoautor1",
                    description:
                        "Discente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
                {
                    name: "Kaike da Silva Sathler",
                    image: fotoNovo5,
                    link: "https://www.instagram.com/novoautor1",
                    description:
                        "Discente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
                {
                    name: "Vagner Simoes",
                    image: fotoNovo3,
                    link: "https://www.instagram.com/prof.vagnersantos",
                    description:
                        "Docente do Instituto Federal do Paraná - Campus Assis Chateaubriand",
                },
            ],
        };
    },
};
</script>
