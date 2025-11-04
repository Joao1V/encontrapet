create type enum_animals_size as enum ('small', 'medium', 'large');

alter type enum_animals_size owner to postgres;

create type enum_animals_gender as enum ('male', 'female', 'unknown');

alter type enum_animals_gender owner to postgres;

create type enum_publications_type as enum ('lost', 'found', 'adoption');

alter type enum_publications_type owner to postgres;

create type enum_publications_status as enum ('open', 'closed', 'resolved');

alter type enum_publications_status owner to postgres;

create type enum_users_role as enum ('admin', 'user');

alter type enum_users_role owner to postgres;

create type enum_animals_species as enum ('dog', 'cat');

alter type enum_animals_species owner to postgres;