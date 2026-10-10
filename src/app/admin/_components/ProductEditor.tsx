"use client";
import { Check, ImagePlus, X } from "lucide-react";
import { Photo } from "@/components/product/Photo";
import type { Product } from "@/lib/types/store";
import { Modal } from "./Modal";
import { useProductEditor } from "../_lib/use-product-editor";

export function ProductEditor({
  product,
  close,
}: {
  product: Product | null;
  close: () => void;
}) {
  const {
    name,
    setName,
    category,
    setCategory,
    price,
    setPrice,
    stock,
    setStock,
    description,
    setDescription,
    material,
    setMaterial,
    dimensions,
    setDimensions,
    images,
    setImages,
    active,
    setActive,
    featured,
    setFeatured,
    uploading,
    error,
    upload,
    submit,
    categories,
  } = useProductEditor(product, close);
  return (
    <Modal
      title={product ? "Editar produto" : "Cadastrar um novo encanto"}
      close={close}
    >
      <form className="product-editor" onSubmit={submit}>
        <p className="form-hint">
          Alterações válidas apenas neste navegador. Todos os campos são
          obrigatórios.
        </p>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 md:gap-5">
          <label className="col-span-2">
            Nome do produto
            <input
              autoFocus
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Colar Jardim"
            />
          </label>
          <label>
            Categoria
            <input
              required
              maxLength={40}
              list="category-options"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label>
            Preço (R$)
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="39,90"
            />
          </label>
          <label>
            Estoque
            <input
              required
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>
          <label>
            Material
            <input
              required
              maxLength={150}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Ex.: Liga metálica dourada"
            />
          </label>
          <label className="col-span-2">
            Medidas
            <input
              required
              maxLength={150}
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="Ex.: 40 cm + extensor de 5 cm"
            />
          </label>
          <label className="col-span-2">
            Descrição
            <textarea
              required
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte os detalhes desse encanto…"
            />
          </label>
        </div>
        <div className="editor-photos">
          <h3>Fotos do produto</h3>
          <small>
            JPG, PNG ou WebP • até 5 MB por foto • máximo de 5 fotos. A primeira
            é a capa.
          </small>
          {!images.length && (
            <button
              className="text-link mt-3"
              type="button"
              onClick={() => setImages(["/images/placeholder.svg"])}
            >
              Usar imagem de demonstração
            </button>
          )}
          <div className="upload-list">
            {images.map((source, i) => (
              <div key={source}>
                <Photo source={source} alt={`Foto ${i + 1} do produto`} />
                <button
                  className="icon-button"
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, index) => i !== index))
                  }
                  aria-label={`Remover foto ${i + 1}`}
                >
                  <X size={14} />
                </button>
                {i === 0 && <span>Capa</span>}
              </div>
            ))}
            <label className="upload-button">
              <ImagePlus size={24} />
              <span>{uploading ? "Salvando…" : "Adicionar fotos"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading || images.length >= 5}
                onChange={(e) => {
                  void upload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
        <div className="editor-checks">
          <label>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />{" "}
            Visível na loja
          </label>
          <label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />{" "}
            Destaque na página inicial
          </label>
        </div>
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button className="button outline" type="button" onClick={close}>
            Cancelar
          </button>
          <button className="button" type="submit" disabled={uploading}>
            <Check size={17} /> Salvar produto
          </button>
        </div>
      </form>
    </Modal>
  );
}
